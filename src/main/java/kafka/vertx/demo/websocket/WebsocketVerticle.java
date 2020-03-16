/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.websocket;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.ServerWebSocket;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import kafka.vertx.demo.consumer.ConsumerService;
import kafka.vertx.demo.consumer.ConsumerVerticle;
import kafka.vertx.demo.producer.PeriodicProducer;

public class WebsocketVerticle extends AbstractVerticle {

    private boolean consuming = false;
    private String topic = "test";
    private String periodicProducerVerticleId = "";

    private static final String PRODUCE_PATH = "/demoproduce";
    private static final String CONSUME_PATH = "/democonsume";

    @Override
    public void start(Promise<Void> done) {
        HttpServer server = vertx.createHttpServer();
        Router router = Router.router(vertx);
        router.get().handler(StaticHandler.create());
        server.websocketHandler(websocket -> {
            String path = websocket.path();
            if (PRODUCE_PATH.equals(path)) {
                handleProduceSocket(websocket);
            } else if (CONSUME_PATH.equals(path)) {
                handleConsumeSocket(websocket);
            } else {
                websocket.reject();
            }
        }).requestHandler(router).listen(8080, "localhost", res -> res.map(v -> {
            System.out.printf("WebSocket is now listening%n");
            done.complete();
            return null;
        }).otherwise(t -> {
            System.out.printf("WebSocket failed to listen: %s%n", t);
            done.fail(res.cause());
            return null;
        }));
    }

    private void handleProduceSocket(ServerWebSocket websocket) {
        websocket.handler(buffer -> {
            String websocketMessage = buffer.getString(0, buffer.length());
            JsonObject messageObject = new JsonObject(websocketMessage);
            String action = messageObject.getString("action");

            if (action.equals("start") && periodicProducerVerticleId.isEmpty()) {
                String custom = messageObject.getString("custom");
                String message = custom == null ? "" : custom;

                PeriodicProducer periodicProducer = new PeriodicProducer(topic, message, websocket.textHandlerID());

                vertx.deployVerticle(periodicProducer, res -> res.map(id -> {
                    periodicProducerVerticleId = id;
                    System.out.println("Producing records...");
                    return null;
                }).otherwise(t -> {
                    System.out.printf("Failed to deploy periodicProducer verticle: %s%n", t);
                    return null;
                }));
            }
            if (action.equals("stop")) {
                undeployPeriodicProducer();
            }
        });
    }

    private void undeployPeriodicProducer() {
        System.out.printf("Current producer id: %s%n", periodicProducerVerticleId);
        if (!periodicProducerVerticleId.isEmpty()) {
            vertx.undeploy(periodicProducerVerticleId, res -> res.map(v -> {
                periodicProducerVerticleId = "";
                System.out.printf("Periodic producer verticle undeployed.%n");
                return null;
            }).otherwise(t -> {
                System.out.printf("Failed to undeploy periodicProducer verticle: %s%n", t);
                return null;
            }));
        }
    }

    private void handleConsumeSocket(ServerWebSocket websocket) {
        ConsumerService consumerService = ConsumerService.createProxy(vertx, ConsumerVerticle.ADDRESS);
        websocket.handler(buffer -> {
            String message = buffer.getString(0, buffer.length());
            JsonObject messageObject = new JsonObject(message);
            String action = messageObject.getString("action");
            if (action.equals("start") && !consuming) {
                consumerService.subscribe(topic, websocket.textHandlerID(), res -> res.map(v -> {
                    consuming = true;
                    System.out.printf("Consuming records...%n");
                    return null;
                }).otherwise(t -> {
                    System.out.printf("Failed to start consuming: %s%n", t);
                    return null;
                }));
            }
            if (action.equals("stop") && consuming) {
                pauseConsumer(consumerService);
            }
        });
    }

    private void pauseConsumer(ConsumerService consumer) {
        if (consuming) {
            consumer.pause(topic, res -> res.map(v -> {
                consuming = false;
                System.out.printf("Stopped consuming.%n");
                return null;
            }).otherwise(t -> {
                System.out.printf("Failed to pause the consumer: %s%n", t);
                return null;
            }));
        }
    }
}
