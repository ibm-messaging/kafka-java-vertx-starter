/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.TimeoutStream;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;

public class PeriodicProducer extends AbstractVerticle {

  private static final Logger logger = LoggerFactory.getLogger(PeriodicProducer.class);
  private String customMessage;

  @Override
  public void start(Promise<Void> startPromise) {
    String propertiesPath = System.getProperty(Main.PROPERTIES_PATH_ENV_NAME, Main.DEFAULT_PROPERTIES_PATH);
    Main.loadKafkaConfig(vertx, propertiesPath)
      .onSuccess(config -> {
        HashMap<String, String> props = config.mapTo(HashMap.class);
        setup(props);
        startPromise.complete();
      })
      .onFailure(startPromise::fail);
  }

  private void setup(HashMap<String, String> props) {
    // Don't retry and only wait 10 secs for partition info as this is a demo app
    props.put(ProducerConfig.RETRIES_CONFIG, "0");
    props.put(ProducerConfig.MAX_BLOCK_MS_CONFIG, "10000");
    KafkaProducer<String, String> kafkaProducer = KafkaProducer.create(vertx, props);

    kafkaProducer.exceptionHandler(err -> logger.debug("Kafka error: {}", err));

    TimeoutStream timerStream = vertx.periodicStream(2000);
    timerStream.handler(tick -> produceKafkaRecord(kafkaProducer, props.get(Main.TOPIC_KEY)));
    timerStream.pause();

    vertx.eventBus().<JsonObject>consumer(Main.PERIODIC_PRODUCER_ADDRESS, message -> handleCommand(timerStream, message));
    logger.info("🚀 PeriodicProducer started");
  }

  private void handleCommand(TimeoutStream timerStream, Message<JsonObject> message) {
    String command = message.body().getString(WebSocketServer.ACTION, "none");
    if (WebSocketServer.START_ACTION.equals(command)) {
      logger.info("Producing Kafka records");
      customMessage = message.body().getString("custom", "Hello World");
      timerStream.resume();
    } else if (WebSocketServer.STOP_ACTION.equals(command)) {
      logger.info("Stopping producing Kafka records");
      timerStream.pause();
    }
  }

  private void produceKafkaRecord(KafkaProducer<String, String> kafkaProducer, String topic) {
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
      .onFailure(err -> logger.error("Error sending {}", payload, err));
  }
}
