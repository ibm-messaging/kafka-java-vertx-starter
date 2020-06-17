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
import java.nio.file.Path;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

import static java.lang.System.currentTimeMillis;

public class Main {

  public static final String PERIODIC_PRODUCER_ADDRESS = "demo.periodic.producer";
  public static final String PERIODIC_PRODUCER_BROADCAST = "demo.periodic.producer.broadcast";
  public static final String TOPIC_KEY = "topic";
  public static final String PROPERTIES_PATH_ENV_NAME = "properties_path";
  public static final String DEFAULT_PROPERTIES_PATH = "kafka.properties";

  private static final String DEFAULT_TOPIC = "demo";

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

  public static Future<JsonObject> loadKafkaConfig(Vertx vertx, String propertiesPath) {
    File propertiesPathFile = new File(propertiesPath);
    String properties = propertiesPathFile.isDirectory() ? new File(propertiesPathFile, DEFAULT_PROPERTIES_PATH).toString() : propertiesPath;
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
          return Future.failedFuture(String.format("Kafka properties file is missing. Either specify using -D%s=<path> or use the default path of %s.", PROPERTIES_PATH_ENV_NAME, DEFAULT_PROPERTIES_PATH));
        }
      });
  }

  public static HashMap<String, String> getKafkaConfig(JsonObject properties, String propertiesPath) {
    Path propertiesAbsolutePath = new File(propertiesPath).toPath().toAbsolutePath();
    String propertiesDir;
    if (propertiesAbsolutePath.toFile().isDirectory()) {
      propertiesDir = propertiesAbsolutePath.toString();
    } else {
      propertiesDir = propertiesAbsolutePath.getParent().toString();
    }
    HashMap<String, String> kafkaConfig = new HashMap<>();
    properties.forEach(entry -> {
      String key = entry.getKey();
      String value = entry.getValue().toString();
      if (SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG.equals(key) || SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG.equals(key)) {
        File trustStorefile = new File(value);
        if (!trustStorefile.isAbsolute()) {
          value = new File(propertiesDir, value).toString();
        }
      }
      kafkaConfig.put(key, value);
    });
    kafkaConfig.putIfAbsent(TOPIC_KEY, DEFAULT_TOPIC);
    return kafkaConfig;
  }
}
