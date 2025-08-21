/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Duration;
import java.util.Map;
import java.util.stream.Collectors;

public class PeriodicProducer extends AbstractVerticle {

  private static final Logger logger = LoggerFactory.getLogger(PeriodicProducer.class);
  private static final long PRODUCE_INTERVAL_MS = Duration.ofSeconds(2).toMillis();

  private KafkaProducer<String, String> kafkaProducer;
  private static final long TIMER_NOT_SET = -1L;
  private long timerId = TIMER_NOT_SET;
  private String customMessage = "Hello World";

  @Override
  public void start(Promise<Void> startPromise) {
    String propertiesPath = System.getProperty(
        Main.PROPERTIES_PATH_ENV_NAME,
        Main.DEFAULT_PROPERTIES_PATH
    );

    Main.loadKafkaConfig(vertx, propertiesPath)
      .onSuccess(config -> {
        setup(config);
        startPromise.complete();
      })
      .onFailure(startPromise::fail);
  }

  private void setup(JsonObject config) {
    // Convert JsonObject config -> Map<String,String>
    Map<String, String> props = config.getMap()
        .entrySet()
        .stream()
        .collect(Collectors.toMap(
            Map.Entry::getKey,
            e -> String.valueOf(e.getValue())
        ));

    props.put(ProducerConfig.RETRIES_CONFIG, "0");
    props.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, "10000");

    kafkaProducer = KafkaProducer.create(vertx, props);
    kafkaProducer.exceptionHandler(err -> logger.error("Kafka producer error", err));

    vertx.eventBus()
        .<JsonObject>consumer(Main.PERIODIC_PRODUCER_ADDRESS,
            msg -> handleCommand(props, msg));

    logger.info("🚀 PeriodicProducer started");
  }

  private void handleCommand(Map<String, String> props, Message<JsonObject> message) {
    String command = message.body().getString(WebSocketServer.ACTION, "none");
    switch (command) {
      case WebSocketServer.START_ACTION:
        customMessage = message.body().getString("custom", "Hello World");
        if (timerId == TIMER_NOT_SET) {
          timerId = vertx.setPeriodic(PRODUCE_INTERVAL_MS,
            id -> produceKafkaRecord(props.get(Main.TOPIC_KEY)));
          logger.info("Producing Kafka records with message template: {}", customMessage);
        }
        break;

      case WebSocketServer.STOP_ACTION:
        if (timerId != TIMER_NOT_SET) {
          vertx.cancelTimer(timerId);
          timerId = TIMER_NOT_SET;
          logger.info("Stopped producing Kafka records");
        }
        break;

      default:
        logger.warn("Unknown command received: {}", command);
    }
  }

  private void produceKafkaRecord(String topic) {
    String payload = customMessage;
    KafkaProducerRecord<String, String> record = KafkaProducerRecord.create(topic, payload);
    logger.debug("Producing record to topic {} with payload {}", topic, payload);

    kafkaProducer
      .send(record)
      .onSuccess(metadata -> {
        JsonObject kafkaMetaData = new JsonObject()
          .put("topic", metadata.getTopic())
          .put("partition", metadata.getPartition())
          .put("offset", metadata.getOffset())
          .put("timestamp", metadata.getTimestamp())
          .put("value", payload);
        vertx.eventBus().send(Main.PERIODIC_PRODUCER_BROADCAST, kafkaMetaData);
      })
      .onFailure(err -> {
        logger.error("Error sending {}", payload, err);
        vertx.eventBus().send(Main.PERIODIC_PRODUCER_BROADCAST, new JsonObject().put("status", "ERROR"));
      });
  }

  @Override
  public void stop() {
    if (kafkaProducer != null) {
      kafkaProducer.close()
        .onComplete(ar -> logger.info("KafkaProducer closed: {}", ar.succeeded() ? "success" : ar.cause()));
    }
  }
}
