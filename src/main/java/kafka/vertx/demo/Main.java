package kafka.vertx.demo;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.spi.resolver.ResolverProvider;
import kafka.vertx.demo.consumer.ConsumerVerticle;
import kafka.vertx.demo.producer.ProducerVerticle;
import kafka.vertx.demo.websocket.WebsocketVerticle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

import static java.lang.System.currentTimeMillis;

public class Main {

  private static String websocketVerticleName = "websocket";
  private static String producerVerticleName = "producer";
  private static String consumerVerticleName = "consumer";

  private static final Logger logger = LoggerFactory.getLogger(Main.class);

  public static void main(String[] args) {
    long startTime = currentTimeMillis();

    // Set vertx timeout to deal with slow DNS connections
    System.setProperty(ResolverProvider.DISABLE_DNS_RESOLVER_PROP_NAME, "true");
    Vertx vertx = Vertx.vertx(
      new VertxOptions()
        .setWarningExceptionTime(10).setWarningExceptionTimeUnit(TimeUnit.SECONDS)
        .setMaxEventLoopExecuteTime(20).setMaxEventLoopExecuteTimeUnit((TimeUnit.SECONDS)));

    Future<String> webSocketDeployment = vertx
      .deployVerticle(new WebsocketVerticle())
      .onSuccess(id -> verticleDeployed(websocketVerticleName, id))
      .onFailure(err -> verticleFailedToDeploy(websocketVerticleName, err));

    Future<String> producerDeployment = vertx
      .deployVerticle(new ProducerVerticle())
      .onSuccess(id -> verticleDeployed(producerVerticleName, id))
      .onFailure(err -> verticleFailedToDeploy(producerVerticleName, err));

    Future<String> consumerDeployment = vertx
      .deployVerticle(new ConsumerVerticle())
      .onSuccess(id -> verticleDeployed(consumerVerticleName, id))
      .onFailure(err -> verticleFailedToDeploy(consumerVerticleName, err));

    // Create CompositeFuture to wait for verticles to start
    CompositeFuture.join(webSocketDeployment, producerDeployment, consumerDeployment)
      .onSuccess(res -> appStarted(currentTimeMillis() - startTime))
      .onFailure(Main::appFailedToStart);
  }

  private static void appFailedToStart(Throwable t) {
    logger.error("❌ Application failed to start", t);
  }

  private static void appStarted(long duration) {
    logger.info("✅ Application has started in {}ms, go to http://localhost:8080 to see the app running.", duration);
  }

  private static void verticleDeployed(String name, String id) {
    logger.info("🚀 Verticle {} deployed: {}", name, id);
  }

  private static void verticleFailedToDeploy(String name, Throwable err) {
    logger.error("❌ Verticle {} failed to deploy: {}", name, err.getMessage());
  }
}
