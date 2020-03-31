/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.TimeoutStream;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.HashMap;

public class PeriodicProducer extends AbstractVerticle {

  private static final Logger logger = LoggerFactory.getLogger(PeriodicProducer.class);
  private String customMessage;

  @Override
  public void start(Promise<Void> startPromise) {
    ConfigRetriever.create(vertx,
      new ConfigRetrieverOptions().addStore(
        new ConfigStoreOptions()
          .setType("file")
          .setFormat("properties")
          .setConfig(new JsonObject().put("path", "kafka.properties").put("raw-data", true))))
      .getConfig()
      .onSuccess(config -> setup(config, startPromise))
      .onFailure(startPromise::fail);
  }

  private void setup(JsonObject config, Promise<Void> startPromise) {
    HashMap<String, String> props = new HashMap<>();
    config.forEach(entry -> props.put(entry.getKey(), entry.getValue().toString()));
    KafkaProducer<String, String> kafkaProducer = KafkaProducer.create(vertx, props);

    kafkaProducer.exceptionHandler(err -> logger.error("Kafka error: {}", err));

    TimeoutStream timerStream = vertx.periodicStream(2000);
    timerStream.handler(tick -> produceKafkaRecord(kafkaProducer));
    timerStream.pause();

    vertx.eventBus().<JsonObject>consumer(Main.PERIODIC_PRODUCER_ADDRESS, message -> handleCommand(timerStream, message));
    logger.info("🚀 PeriodicProducer started");
    startPromise.complete();
  }

  private void handleCommand(TimeoutStream timerStream, Message<JsonObject> message) {
    String command = message.body().getString("action", "none");
    if ("start".equals(command)) {
      logger.info("Producing Kafka records");
      customMessage = message.body().getString("custom", "Hello World");
      timerStream.resume();
    } else if ("stop".equals(command)) {
      logger.info("Stopping producing Kafka records");
      timerStream.pause();
    }
  }

  private void produceKafkaRecord(KafkaProducer<String, String> kafkaProducer) {
    String payload = customMessage;

    KafkaProducerRecord<String, String> record = KafkaProducerRecord.create(Main.TOPIC, payload);

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
      .onFailure(err -> logger.error("Error sending {}", payload, err));
  }
}
