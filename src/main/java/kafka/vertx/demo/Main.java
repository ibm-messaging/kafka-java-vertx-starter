package kafka.vertx.demo;

import io.vertx.core.*;
import io.vertx.core.spi.resolver.ResolverProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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

    Future<String> periodicProducerDeployment = vertx.deployVerticle(new PeriodicProducer());
    Future<String> webSocketServerDeployment = vertx.deployVerticle(new WebSocketServer());

    CompositeFuture.all(periodicProducerDeployment, webSocketServerDeployment)
      .onSuccess(ok -> logger.info("✅ Application started in {}ms", currentTimeMillis() - startTime))
      .onFailure(err -> logger.error("❌ Application failed to start", err));
  }
}
