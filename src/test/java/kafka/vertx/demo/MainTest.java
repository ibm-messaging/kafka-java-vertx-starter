/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo;

import static org.hamcrest.CoreMatchers.is;

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

  @DisplayName("when calling config processor, provided properties are copied into returned config")
  @Test
  public void testConfigCopied() {
    JsonObject properties = new JsonObject()
      .put("broker", "localhost:8080")
      .put("groupId", "1")
      .put("topic", "test");
    JsonObject kafkaConfig = Main.configurationProcessor(DEFAULT_PROPERTIES_PATH).apply(properties);
    assertThat(kafkaConfig.getString("broker"), is("localhost:8080"));
    assertThat(kafkaConfig.getString("groupId"), is("1"));
    assertThat(kafkaConfig.getString("topic"), is("test"));
  }

  @DisplayName("when calling config processor, relative truststore path is converted to absolute")
  @Test
  public void testConfigConvertsTruststoreToAbsolute() {
    String propertiesPath = "/kafka/config/kafka.properties";
    String relativePath = "cert.jks";
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, relativePath);
    JsonObject kafkaConfig = Main.configurationProcessor(propertiesPath).apply(properties);
    String truststorePath = kafkaConfig.getString(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG);
    String expectedPath = "/kafka/config/" + relativePath;
    assertThat(truststorePath, is(expectedPath));
  }

  @DisplayName("when calling config processor, absolute truststore path is unchanged")
  @Test
  public void testConfigKeepsTruststoreAsAbsolute() {
    String propertiesPath = "/kafka/config/kafka.properties";
    String certPath = new File("cert.jks").toPath().toAbsolutePath().toString();
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, certPath);
    JsonObject kafkaConfig = Main.configurationProcessor(propertiesPath).apply(properties);
    String truststorePath = kafkaConfig.getString(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG);
    assertThat(truststorePath, is(certPath));
  }

  @DisplayName("when calling config processor, relative keystore path is converted to absolute")
  @Test
  public void testConfigConvertsKeystoreToAbsolute() {
    String relativePath = "user.jks";
    String propertiesPath = "/kafka/config/kafka.properties";
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, relativePath);
    JsonObject kafkaConfig = Main.configurationProcessor(propertiesPath).apply(properties);
    String keystorePath = kafkaConfig.getString(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG);
    String expectedPath = "/kafka/config/" + relativePath;
    assertThat(keystorePath, is(expectedPath));
  }

  @DisplayName("when calling config processor, topic name is defaulted if missing")
  @Test
  public void testGetKafkaConfigTopicMissing() {
    JsonObject kafkaConfig = Main.configurationProcessor("kafka.properties").apply(new JsonObject());
    assertThat(kafkaConfig.getString("topic"), is("demo"));
  }

  @DisplayName("when calling config processor, absolute keystore path is unchanged")
  @Test
  public void testConfigPathAsDir() {
    Path resourceDirectory = Paths.get("src","test","resources");
    String propertiesPath = resourceDirectory.toFile().getAbsolutePath();
    JsonObject properties = new JsonObject()
      .put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, "cert.jks");
    JsonObject kafkaConfig = Main.configurationProcessor(propertiesPath).apply(properties);
    String keystorePath = kafkaConfig.getString(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG);
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
