/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.collection.IsMapContaining.hasEntry;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.apache.kafka.common.config.SslConfigs;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import static org.hamcrest.MatcherAssert.assertThat;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;

@ExtendWith(VertxExtension.class)
public class MainTest {
  private static Vertx vertx;
  private static final String DEFAULT_PROPERTIES_PATH = new File("kafka.properties").toPath().toAbsolutePath().toString();

  @BeforeAll
  public static void setup() {
    vertx = Vertx.vertx();
  }
  @AfterAll
  public static void closeVertxInstance() {
    vertx.close();
  }

  @DisplayName("when calling getKafkaConfig, provided properties are copied into returned config")
  @Test
  public void testConfigCopied() {
    JsonObject properties = new JsonObject()
      .put("broker", "localhost:8080")
      .put("groupId", "1")
      .put("topic", "test");
    HashMap<String, String> kafkaConfig = Main.getKafkaConfig(properties, DEFAULT_PROPERTIES_PATH);
    assertThat(kafkaConfig, hasEntry("broker", "localhost:8080"));
    assertThat(kafkaConfig, hasEntry("groupId", "1"));
    assertThat(kafkaConfig, hasEntry("topic", "test"));
  }

  @DisplayName("when calling getKafkaConfig, relative truststore path is converted to absolute")
  @Test
  public void testConfigConvertsTruststoreToAbsolute() {
    String relativePath = "cert.jks";
    String propertiesPath = "/kafka/config/kafka.properties";
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, relativePath);
    HashMap<String, String> kafkaConfig = Main.getKafkaConfig(properties, propertiesPath);
    String truststorePath = kafkaConfig.get(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG);
    String expectedPath = "/kafka/config/" + relativePath;
    assertThat(truststorePath, is(expectedPath));
  }

  @DisplayName("when calling getKafkaConfig, absolute truststore path is unchanged")
  @Test
  public void testConfigKeepsTruststoreAsAbsolute() {
    String path = new File("cert.jks").toPath().toAbsolutePath().toString();
    String propertiesPath = "/kafka/config/kafka.properties";
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, path);
    HashMap<String, String> kafkaConfig = Main.getKafkaConfig(properties, propertiesPath);
    String truststorePath = kafkaConfig.get(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG);
    assertThat(truststorePath, is(path));
  }

  @DisplayName("when calling getKafkaConfig, relative keystore path is converted to absolute")
  @Test
  public void testConfigConvertsKeystoreToAbsolute() {
    String relativePath = "user.jks";
    String propertiesPath = "/kafka/config/kafka.properties";
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, relativePath);
    HashMap<String, String> kafkaConfig = Main.getKafkaConfig(properties, propertiesPath);
    String keystorePath = kafkaConfig.get(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG);
    String expectedPath = "/kafka/config/" + relativePath;
    assertThat(keystorePath, is(expectedPath));
  }

  @DisplayName("when calling getKafkaConfig, topic name is defaulted if missing")
  @Test
  public void testGetKafkaConfigTopicMissing() {
    HashMap<String, String> kafkaConfig = Main.getKafkaConfig(new JsonObject(), "kafka.properties");
    assertThat(kafkaConfig.get("topic"), is("demo"));
  }

  @DisplayName("when calling getKafkaConfig, absolute keystore path is unchanged")
  @Test
  public void testConfigPathAsDir() {
    Path resourceDirectory = Paths.get("src","test","resources");
    String propertiesPath = resourceDirectory.toFile().getAbsolutePath();
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "cert.jks");
    HashMap<String, String> kafkaConfig = Main.getKafkaConfig(properties, propertiesPath);
    String keystorePath = kafkaConfig.get(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG);
    String expectedPath = Paths.get("src","test","resources", "cert.jks").toFile().getAbsolutePath();
    assertThat(keystorePath, is(expectedPath));
  }

  @DisplayName("when calling loadKafkaConfig, properties in the file are loaded")
  @Test
  public void testLoadKafkaConfig(VertxTestContext context) {
    String propertiesPath = Paths.get("src","test","resources", "testConfig", "myconfig.properties").toFile().getAbsolutePath();
    Main.loadKafkaConfig(vertx, propertiesPath).onComplete(context.succeeding(properties -> context.verify(() -> {
      assertThat(properties.getString("mykey1"), is("myvalue1"));
      assertThat(properties.getString("mykey2"), is("myvalue2"));
      context.completeNow();
    })));
  }

  @DisplayName("when calling loadKafkaConfig, future fails if the file does not exist")
  @Test
  public void testLoadKafkaConfigFileMissing(VertxTestContext context) {
    String propertiesPath = Paths.get("src","test","resources", "testConfig", "missing.properties").toFile().getAbsolutePath();

    Main.loadKafkaConfig(vertx, propertiesPath).onComplete(context.failing(err -> context.completeNow()));
  }

  @DisplayName("when calling loadKafkaConfig with a directory, properties in the file kafka.properties are loaded")
  @Test
  public void testLoadKafkaConfigUsingDir(VertxTestContext context) {
    String propertiesPath = Paths.get("src","test","resources", "testConfig").toFile().getAbsolutePath();
    Main.loadKafkaConfig(vertx, propertiesPath).onComplete(context.succeeding(properties -> context.verify(() -> {
      assertThat(properties.getString("key1"), is("value1"));
      assertThat(properties.getString("key2"), is("value2"));
      context.completeNow();
    })));
  }
}
