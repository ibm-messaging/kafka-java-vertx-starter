/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.websocket;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.ServerWebSocket;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import kafka.vertx.demo.consumer.ConsumerService;
import kafka.vertx.demo.consumer.ConsumerVerticle;
import kafka.vertx.demo.producer.PeriodicProducer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebsocketVerticle extends AbstractVerticle {

  private static final String TOPIC = "test";
  private static final String PRODUCE_PATH = "/demoproduce";
  private static final String CONSUME_PATH = "/democonsume";

  private static final Logger logger = LoggerFactory.getLogger(WebsocketVerticle.class);

  private boolean consuming = false;
  private String periodicProducerVerticleId = "";

  @Override
  public void start(Promise<Void> done) {
    HttpServer server = vertx.createHttpServer();
    Router router = Router.router(vertx);
    router.get().handler(StaticHandler.create());
    server
      .requestHandler(router)
      .webSocketHandler(this::handleWebSocket)
      .listen(8080, "localhost")
      .onSuccess(ok -> {
        logger.info("WebSocket is now listening");
        done.complete();
      })
      .onFailure(err -> {
        logger.error("WebSocket failed to listen", err);
        done.fail(err);
      });
  }

  private void handleWebSocket(ServerWebSocket websocket) {
    String path = websocket.path();
    if (PRODUCE_PATH.equals(path)) {
      handleProduceSocket(websocket);
    } else if (CONSUME_PATH.equals(path)) {
      handleConsumeSocket(websocket);
    } else {
      websocket.reject();
    }
  }

  private void handleProduceSocket(ServerWebSocket websocket) {
    websocket.handler(buffer -> {
      JsonObject messageObject = buffer.toJsonObject();
      String action = messageObject.getString("action");

      if ("start".equals(action) && periodicProducerVerticleId.isEmpty()) {
        String message = messageObject.getString("custom", "");
        PeriodicProducer periodicProducer = new PeriodicProducer(TOPIC, message, websocket.textHandlerID());

        vertx.deployVerticle(periodicProducer)
          .onSuccess(id -> {
            periodicProducerVerticleId = id;
            logger.info("Producing records...");
          })
          .onFailure(err -> logger.error("Failed to deploy periodicProducer verticle", err));
      }
      
      if ("stop".equals(action)) {
        undeployPeriodicProducer();
      }
    });
  }

  private void undeployPeriodicProducer() {
    logger.info("Current producer id: {}", periodicProducerVerticleId);
    if (!periodicProducerVerticleId.isEmpty()) {
      vertx.undeploy(periodicProducerVerticleId)
        .onSuccess(v -> {
          periodicProducerVerticleId = "";
          logger.info("Periodic producer verticle undeployed");
        })
        .onFailure(err -> logger.error("Failed to undeploy periodicProducer verticle", err));
    }
  }

  private void handleConsumeSocket(ServerWebSocket websocket) {
    ConsumerService consumerService = ConsumerService.createProxy(vertx, ConsumerVerticle.ADDRESS);
    websocket.handler(buffer -> {
      JsonObject messageObject = buffer.toJsonObject();
      String action = messageObject.getString("action");
      if ("start".equals(action) && !consuming) {
        consumerService.subscribe(TOPIC, websocket.textHandlerID(), res -> {
          if (res.succeeded()) {
            consuming = true;
            logger.info("Consuming records...");
          } else {
            logger.error("Failed to start consuming", res.cause());
          }
        });
      }
      if (action.equals("stop") && consuming) {
        pauseConsumer(consumerService);
      }
    });
  }

  private void pauseConsumer(ConsumerService consumer) {
    if (consuming) {
      consumer.pause(TOPIC, res -> {
        if (res.succeeded()) {
          consuming = false;
          logger.info("Stopped consuming");
        } else {
          logger.error("Failed to pause the consumer", res.cause());
        }
      });
    }
  }
}
