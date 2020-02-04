package kafka.vertx.demo.consumer;

import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.json.JsonObject;
import io.vertx.serviceproxy.ServiceBinder;

import java.util.Map;

public class ConsumerVerticle extends AbstractVerticle {

    public static final String ADDRESS = "kafka-consumer-service-address";

    private ServiceBinder binder;
    private MessageConsumer<JsonObject> consumer;

    @Override
    public void start(Promise<Void> done) {
        binder = new ServiceBinder(vertx);
        ConfigRetriever retriever = ConfigRetriever.create(vertx,
                new ConfigRetrieverOptions().addStore(
                        new ConfigStoreOptions()
                                .setType("file")
                                .setFormat("properties")
                                .setConfig(new JsonObject().put("path", "kafka.properties").put("raw-data", true))
                ));
        retriever.getConfig(res -> res.map(config -> {
            Map<String, String> configMap = config.mapTo(Map.class);
            ConsumerService service = new ConsumerServiceImpl(vertx, configMap);
            consumer = binder.setAddress(ADDRESS)
                    .register(ConsumerService.class, service);
            done.complete();
            return null;
        }).otherwise(t -> {
            done.fail(t);
            return null;
        }));
    }

    @Override
    public void stop() {
        binder.unregister(consumer);
    }
}
