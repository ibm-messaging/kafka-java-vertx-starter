package kafka.vertx.demo;

import io.vertx.core.CompositeFuture;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.dns.AddressResolverOptions;
import io.vertx.core.spi.resolver.ResolverProvider;
import kafka.vertx.demo.consumer.ConsumerVerticle;
import kafka.vertx.demo.producer.ProducerVerticle;
import kafka.vertx.demo.websocket.WebsocketVerticle;

import java.util.concurrent.TimeUnit;

public class Main {

    private static String websocketVerticleName = "websocket";
    private static String producerVerticleName = "producer";
    private static String consumerVerticleName = "consumer";

    public static void main(String[] args) {
        // Set vertx timeout to deal with slow DNS connections
        System.setProperty(ResolverProvider.DISABLE_DNS_RESOLVER_PROP_NAME, "true");
        Vertx vertx = Vertx.vertx(
                new VertxOptions()
                        .setWarningExceptionTime(10).setWarningExceptionTimeUnit(TimeUnit.SECONDS)
                        .setMaxEventLoopExecuteTime(20).setMaxEventLoopExecuteTimeUnit((TimeUnit.SECONDS)));

        // Instantiating WebSocket Verticle
        Future websocketVerticleFuture = Future.future(promise -> {
            WebsocketVerticle websocketVerticle = new WebsocketVerticle();
            vertx.deployVerticle(websocketVerticle, res -> res.map(id -> handleSuccessfulDeploy(websocketVerticleName, id, promise))
                    .otherwise(t -> handleFailedDeploy(websocketVerticleName, t, promise)));
        });

        // Instantiating Producer Verticle to enable consuming Kafka event
        Future producerVerticleFuture = Future.future(promise -> {
            ProducerVerticle producerVerticle = new ProducerVerticle();
            vertx.deployVerticle(producerVerticle, res -> res.map(id -> handleSuccessfulDeploy(producerVerticleName, id, promise))
                    .otherwise(t -> handleFailedDeploy(producerVerticleName, t, promise)));
        });

        // Instantiating Consumer Verticle to enable consume Kafka events
        Future consumerVerticleFuture = Future.future(promise -> {
            ConsumerVerticle consumerVerticle = new ConsumerVerticle();
            vertx.deployVerticle(consumerVerticle, res -> res.map(id -> handleSuccessfulDeploy(consumerVerticleName, id, promise))
                    .otherwise(t -> handleFailedDeploy(consumerVerticleName, t, promise)));
        });

        // Create CompositeFuture to wait for verticles to start
        CompositeFuture.join(websocketVerticleFuture, producerVerticleFuture, consumerVerticleFuture)
                .onSuccess(res -> System.out.printf("Application has started, go to localhost:8080 to see the app running.\n"))
                .onFailure(t -> System.out.printf("Application failed to start: %s%n", t));

    }

    private static Void handleSuccessfulDeploy(String verticleName, String id, Promise promise) {
        System.out.printf("Verticle %s deployed: %s%n", verticleName, id);
        promise.complete();
        return null;
    }

    private static Void handleFailedDeploy(String verticleName, Throwable t, Promise promise) {
        System.out.printf("Verticle %s failed to deploy: %s%n", verticleName, t);
        promise.fail(t);
        return null;
    }
}
