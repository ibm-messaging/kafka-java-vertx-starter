/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.*;
import io.vertx.core.file.FileSystem;
import io.vertx.core.json.JsonObject;
import io.vertx.core.spi.resolver.ResolverProvider;
import org.apache.kafka.common.config.SslConfigs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.HashMap;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static java.lang.System.currentTimeMillis;

public class Main {

  public static final String TOPIC = "demo";
  public static final String PERIODIC_PRODUCER_ADDRESS = "demo.periodic.producer";
  public static final String PERIODIC_PRODUCER_BROADCAST = "demo.periodic.producer.broadcast";

  private static final Logger logger = LoggerFactory.getLogger(Main.class);

  public static void main(String[] args) {
    long startTime = currentTimeMillis();

    // Set vertx timeout to deal with slow DNS connections
    System.setProperty(ResolverProvider.DISABLE_DNS_RESOLVER_PROP_NAME, "true");
    Vertx vertx = Vertx.vertx(
      new VertxOptions()
        .setWarningExceptionTime(10).setWarningExceptionTimeUnit(TimeUnit.SECONDS)
        .setMaxEventLoopExecuteTime(20).setMaxEventLoopExecuteTimeUnit((TimeUnit.SECONDS)));

    ConfigRetriever.create(vertx,
      new ConfigRetrieverOptions().addStore(
        new ConfigStoreOptions()
          .setType("file")
          .setFormat("properties")
          .setConfig(new JsonObject().put("path", "project.properties"))
      )
    ).getConfig().onSuccess(config -> logger.info("Application version: " + config.getString("app.version")));

    Future<String> periodicProducerDeployment = vertx.deployVerticle(new PeriodicProducer());
    Future<String> webSocketServerDeployment = vertx.deployVerticle(new WebSocketServer());

    CompositeFuture.all(periodicProducerDeployment, webSocketServerDeployment)
      .onSuccess(ok -> logger.info("✅ Application started in {}ms", currentTimeMillis() - startTime))
      .onFailure(err -> logger.error("❌ Application failed to start", err));
  }

  public static Future<JsonObject> loadKafkaConfig(Vertx vertx, String path) {
    String propertiesPath = Optional.ofNullable(path).orElse("kafka.properties");
    File propertiesPathFile = new File(propertiesPath);
    String properties = propertiesPathFile.isDirectory() ? new File(propertiesPathFile, "kafka.properties").toString() : propertiesPath;
    ConfigRetriever configRetriever =  ConfigRetriever.create(vertx,
      new ConfigRetrieverOptions().addStore(
        new ConfigStoreOptions()
          .setType("file")
          .setFormat("properties")
          .setConfig(new JsonObject().put("path", properties).put("raw-data", true))));
    FileSystem fileSystem = vertx.fileSystem();
    return fileSystem.exists(properties)
      .compose(exists -> {
        if (exists) {
          return configRetriever.getConfig();
        } else {
          return Future.failedFuture("Kafka properties file is missing. Either specify using -Dproperties_path=<path> or use the default path of kafka.properties.");
        }
      });
  }

  public static HashMap<String, String> getKafkaConfig(JsonObject properties, String propertiesPath) {
    HashMap<String, String> kafkaConfig = new HashMap<>();
    properties.forEach(entry -> {
      String key = entry.getKey();
      String value = entry.getValue().toString();
      if (SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG.equals(key) || SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG.equals(key)) {
        File trustStorefile = new File(value);
        if (trustStorefile.isAbsolute()) {
          value = trustStorefile.toString();
        } else {
          File propertiesPathFile = new File(propertiesPath);
          String propertiesDir = propertiesPathFile.isDirectory() ? propertiesPath : new File(propertiesPath).getParentFile().getPath();
          value = new File(propertiesDir, value).toString();
        }
      }
      kafkaConfig.put(key, value);
    });
    return kafkaConfig;
  }
}
