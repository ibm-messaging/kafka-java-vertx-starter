package kafka.vertx.demo;

import static org.hamcrest.MatcherAssert.assertThat;

import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.codec.BodyCodec;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;

@ExtendWith(VertxExtension.class)
public class WebSocketServerTest {

  @BeforeEach
  void setup(Vertx vertx, VertxTestContext testContext) {
    vertx.deployVerticle(new WebSocketServer(), res -> {
      testContext.completeNow();
    });
  }

  @Test
  @DisplayName("Templated html contains correct values")
  void getTemplateResponse(Vertx vertx, VertxTestContext testContext) {
    JsonObject expectedConfig = new JsonObject();
    expectedConfig.put("topic", "demo");
    expectedConfig.put("producerPath", "/demoproduce");
    expectedConfig.put("consumerPath", "/democonsume");

    final String EXPECTED = "content=\"" + expectedConfig.toString().replace("\"", "&quot;") + "\"";

    WebClient client = WebClient.create(vertx);

    client.get(8080, "localhost", "/")
      .as(BodyCodec.string())
      .send(testContext.succeeding(response -> testContext.verify(() -> {
        assertThat(response.body(), CoreMatchers.containsString(EXPECTED));
        testContext.completeNow();
      })));
  }
}
