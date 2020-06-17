/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.ServerWebSocket;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.kafka.client.common.TopicPartition;
import io.vertx.kafka.client.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

public class WebSocketServer extends AbstractVerticle {

  private static final String PRODUCE_PATH = "/demoproduce";
  private static final String CONSUME_PATH = "/democonsume";

  private static final Logger logger = LoggerFactory.getLogger(WebSocketServer.class);

  private HashMap<String, String> kafkaConfig;

  @Override
  public void start(Promise<Void> startPromise) {
    Router router = Router.router(vertx);
    router.get().handler(StaticHandler.create());

    String propertiesPath = System.getProperty(Main.PROPERTIES_PATH_ENV_NAME, Main.DEFAULT_PROPERTIES_PATH);
    Main.loadKafkaConfig(vertx, propertiesPath)
      .compose(config -> {
        kafkaConfig = config.mapTo(HashMap.class);
        return startWebSocket(router);
      })
      .onSuccess(ok -> startPromise.complete())
      .onFailure(startPromise::fail);
  }

  private Future<HttpServer> startWebSocket(Router router) {
    return vertx.createHttpServer()
      .requestHandler(router)
      .webSocketHandler(this::handleWebSocket)
      .listen(8080, "localhost")
      .onSuccess(ok -> logger.info("🚀 WebSocketServer started"))
      .onFailure(err -> logger.error("❌ WebSocketServer failed to listen", err));
  }

  private void handleWebSocket(ServerWebSocket webSocket) {
    switch (webSocket.path()) {
      case PRODUCE_PATH:
        handleProduceSocket(webSocket);
        break;
      case CONSUME_PATH:
        handleConsumeSocket(webSocket);
        break;
      default:
        webSocket.reject();
    }
  }

  private void handleProduceSocket(ServerWebSocket webSocket) {
    EventBus eventBus = vertx.eventBus();

    webSocket.handler(buffer -> {
      JsonObject message = buffer.toJsonObject();
      String action = message.getString("action", "none");
      if ("start".equals(action) || "stop".equals(action)) {
        eventBus.send(Main.PERIODIC_PRODUCER_ADDRESS, message);
      }
    });

    MessageConsumer<JsonObject> consumer = eventBus.<JsonObject>consumer(Main.PERIODIC_PRODUCER_BROADCAST, message ->
      eventBus.send(webSocket.textHandlerID(), message.body().encode()));

    webSocket.endHandler(ended -> {
      logger.info("WebSocket closed from {}", webSocket.remoteAddress().host());
      consumer.unregister();
    });
    webSocket.exceptionHandler(err -> {
      logger.error("WebSocket error", err);
      consumer.unregister();
    });
  }

  private void handleConsumeSocket(ServerWebSocket webSocket) {
    KafkaConsumer<String, JsonObject> kafkaConsumer = KafkaConsumer.create(vertx, kafkaConfig);

    kafkaConsumer.exceptionHandler(err -> logger.error("Kafka error", err));

    kafkaConsumer.handler(record -> {
      JsonObject payload = new JsonObject()
        .put("topic", record.topic())
        .put("partition", record.partition())
        .put("offset", record.offset())
        .put("timestamp", record.timestamp())
        .put("value", record.value());
      vertx.eventBus().send(webSocket.textHandlerID(), payload.encode());
    });

    String topic = kafkaConfig.get(Main.TOPIC_KEY);

    kafkaConsumer.subscribe(topic)
      .onSuccess(ok -> logger.info("Subscribed to {}", topic))
      .onFailure(err -> logger.error("Could not subscribe to {}", topic, err));

    TopicPartition partition = new TopicPartition().setTopic(topic);

    webSocket.handler(buffer -> {
      String action = buffer.toJsonObject().getString("action", "none");
      if ("start".equals(action)) {
        kafkaConsumer.resume(partition)
          .onFailure(err -> logger.error("Cannot resume consumer", err));
      } else if ("stop".equals(action)) {
        kafkaConsumer.pause(partition)
          .onFailure(err -> logger.error("Cannot pause consumer", err));
      }
    });

    webSocket.endHandler(done -> {
      logger.info("WebSocket closed from {}", webSocket.remoteAddress().host());
      kafkaConsumer.close().onFailure(err -> {
        logger.error("Closing Kafka consumer failed", err);
      });
    });

    webSocket.exceptionHandler(err -> {
      logger.error("WebSocket error", err);
      kafkaConsumer.close().onFailure(kerr -> {
        logger.error("Closing Kafka consumer failed", kerr);
      });
    });
  }
}
