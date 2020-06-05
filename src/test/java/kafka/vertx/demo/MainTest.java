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

  @Test
  public void testLoadKafkaConfig(VertxTestContext context) {
    String propertiesPath = Paths.get("src","test","resources", "testConfig", "kafka.properties").toFile().getAbsolutePath();
    Main.loadKafkaConfig(vertx, propertiesPath).onComplete(context.succeeding(properties -> context.verify(() -> {
      assertThat(properties.getString("key1"), is("value1"));
      assertThat(properties.getString("key2"), is("value2"));
      context.completeNow();
    })));
  }

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
