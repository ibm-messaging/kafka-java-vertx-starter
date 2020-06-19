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

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

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

    CompositeFuture.join(periodicProducerDeployment, webSocketServerDeployment)
      .onSuccess(ok -> logger.info("✅ Application started in {}ms", currentTimeMillis() - startTime))
      .onFailure(err -> logger.error("❌ Application failed to start", err));
  }

  public static Future<JsonObject> loadKafkaConfig(Vertx vertx, String properties) {
    Path propertiesPath = Paths.get(properties);
    Path propertiesCompletePath = Files.isDirectory(propertiesPath) ? propertiesPath.resolve(DEFAULT_PROPERTIES_PATH) : propertiesPath;
    ConfigRetriever configRetriever =  ConfigRetriever.create(vertx,
      new ConfigRetrieverOptions().addStore(
        new ConfigStoreOptions()
          .setType("file")
          .setFormat("properties")
          .setConfig(new JsonObject().put("path", propertiesCompletePath.toString()).put("raw-data", true)))).setConfigurationProcessor(configurationProcessor(propertiesPath));
    FileSystem fileSystem = vertx.fileSystem();
    return fileSystem.exists(properties)
      .compose(exists -> {
        if (exists) {
          return configRetriever.getConfig();
        } else {
          return Future.failedFuture(String.format("Kafka properties file at location %s is missing. Either specify using -D%s=<path> or use the default path of %s.", propertiesCompletePath, PROPERTIES_PATH_ENV_NAME, DEFAULT_PROPERTIES_PATH));
        }
      });
  }

  protected static Function<JsonObject, JsonObject> configurationProcessor(Path propertiesPath) {
    Path propertiesAbsolutePath = propertiesPath.toAbsolutePath();
    Path propertiesDir;
    if (Files.isDirectory(propertiesAbsolutePath)) {
      propertiesDir = propertiesAbsolutePath;
    } else {
      propertiesDir = propertiesAbsolutePath.getParent();
    }
    return (properties) -> {
      JsonObject kafkaConfig = new JsonObject();
      properties.forEach(entry -> {
        String key = entry.getKey();
        String value = entry.getValue().toString();
        if (SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG.equals(key) || SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG.equals(key)) {
          Path truststorePath = Paths.get(value);
          if (!truststorePath.isAbsolute()) {
            value = propertiesDir.resolve(value).toString();
          }
        }
        kafkaConfig.put(key, value);
      });
      if (!kafkaConfig.containsKey(TOPIC_KEY)) {
        kafkaConfig.put(TOPIC_KEY, DEFAULT_TOPIC);
      }
      return kafkaConfig;
    };
  }
}
