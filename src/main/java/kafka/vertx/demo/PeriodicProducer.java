/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.TimeoutStream;
import io.vertx.core.eventbus.Message;
import io.vertx.core.file.FileSystem;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;
import org.apache.kafka.common.config.SslConfigs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Optional;

public class PeriodicProducer extends AbstractVerticle {

  private static final Logger logger = LoggerFactory.getLogger(PeriodicProducer.class);
  private String customMessage;

  @Override
  public void start(Promise<Void> startPromise) {
    loadKafkaConfig()
      .onSuccess(config -> {
        setup(config);
        startPromise.complete();
      })
      .onFailure(startPromise::fail);
  }

  private Future<JsonObject> loadKafkaConfig() {
    String path = Optional.ofNullable(System.getProperty("properties_path")).orElse("kafka.properties");
    ConfigRetriever configRetriever =  ConfigRetriever.create(vertx,
      new ConfigRetrieverOptions().addStore(
        new ConfigStoreOptions()
          .setType("file")
          .setFormat("properties")
          .setConfig(new JsonObject().put("path", path).put("raw-data", true))));
    FileSystem fileSystem = vertx.fileSystem();
    return fileSystem.exists(path)
      .compose(exists -> {
        if (exists) {
          return configRetriever.getConfig();
        } else {
          return Future.failedFuture("Kafka properties file is missing. Either specify using -Dproperties_path=<path> or use the default path of kafka.properties.");
        }
      });
  }

  private void setup(JsonObject config) {
    HashMap<String, String> props = new HashMap<>();
    config.forEach(entry -> {
      String key = entry.getKey();
      String value = entry.getValue().toString();
      if (SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG.equals(key) || SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG.equals(key)) {
        File trustStorefile = new File(value);
        value = trustStorefile.toPath().toAbsolutePath().toString();
      }
      props.put(key, value);
    });
    KafkaProducer<String, String> kafkaProducer = KafkaProducer.create(vertx, props);

    String topic = Optional.ofNullable(config.getString("topic")).orElse(Main.TOPIC);

    kafkaProducer.exceptionHandler(err -> logger.error("Kafka error: {}", err));

    TimeoutStream timerStream = vertx.periodicStream(2000);
    timerStream.handler(tick -> produceKafkaRecord(kafkaProducer, topic));
    timerStream.pause();

    vertx.eventBus().<JsonObject>consumer(Main.PERIODIC_PRODUCER_ADDRESS, message -> handleCommand(timerStream, message));
    logger.info("🚀 PeriodicProducer started");
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

  private void produceKafkaRecord(KafkaProducer<String, String> kafkaProducer, String topic) {
    String payload = customMessage;
    KafkaProducerRecord<String, String> record = KafkaProducerRecord.create(topic, payload);

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
