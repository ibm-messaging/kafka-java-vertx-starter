/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.producer;


import io.vertx.config.ConfigRetriever;
import io.vertx.config.ConfigRetrieverOptions;
import io.vertx.config.ConfigStoreOptions;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.eventbus.MessageConsumer;
import io.vertx.core.json.JsonObject;
import io.vertx.serviceproxy.ServiceBinder;

import java.util.HashMap;
import java.util.Map;

public class ProducerVerticle extends AbstractVerticle {

    public static final String ADDRESS = "kafka-producer-service-address";

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
            Map<String, String> configMap = new HashMap<>();
            config.forEach(entry -> configMap.put(entry.getKey(), entry.getValue().toString()));
            ProducerService service = new ProducerServiceImpl(vertx, configMap);
            consumer = binder.setAddress(ADDRESS)
                    .register(ProducerService.class, service);
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