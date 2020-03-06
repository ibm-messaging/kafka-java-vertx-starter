package kafka.vertx.demo.consumer;

import io.vertx.core.AsyncResult;
import io.vertx.core.Future;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.common.TopicPartition;
import io.vertx.kafka.client.consumer.KafkaConsumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class ConsumerServiceImpl implements ConsumerService {

    private KafkaConsumer<String, String> consumer;
    private Vertx vertx;

    //Creating boolean to track whether consumer has already been instantiated and is paused.
    private boolean paused = false;
    private String eventBusId;

    private static final Logger logger = LoggerFactory.getLogger(ConsumerServiceImpl.class);

    public ConsumerServiceImpl(Vertx vertx, Map<String, String> config) {
        this.vertx = vertx;
        consumer = KafkaConsumer.create(vertx, config);
        consumer.exceptionHandler(t -> logger.error("KafkaConsumer Exception", t));
    }

    @Override
    public void subscribe(String topicName, String id, Handler<AsyncResult<Void>> resultHandler) {
        eventBusId = id;
        //if statement to determine whether to instantiate a new consumer or unpause the one that already exists
        if (paused) {
            TopicPartition topicPartition = new TopicPartition()
                    .setTopic(topicName);
            consumer.resume(topicPartition, res -> res.map(result -> {
                paused = false;
                resultHandler.handle(Future.succeededFuture());
                return null;
            }).otherwise(t -> {
                resultHandler.handle(Future.failedFuture(t));
                return null;
            }));
        } else {
            consumer.handler(result -> {
                DemoConsumedRecord consumedRecord = new DemoConsumedRecord(result.topic(), result.partition(), result.offset(), result.value(), result.timestamp());
                JsonObject jsonObject = JsonObject.mapFrom(consumedRecord);
                vertx.eventBus().send(eventBusId, jsonObject.encode());
            });
            consumer.subscribe(topicName, resultHandler);
        }
    }

    @Override
    //Pause used instead of stop in order to be able to unpause and reuse the same consumer and it pick up where it left off
    public void pause(String topicName, Handler<AsyncResult<Void>> resultHandler) {
        TopicPartition topicPartition = new TopicPartition()
                .setTopic(topicName);
        consumer.pause(topicPartition, res -> res.map(result -> {
            paused = true;
            resultHandler.handle(Future.succeededFuture());
            return null;
        }).otherwise(t -> {
            resultHandler.handle(Future.failedFuture(t));
            return null;
        }));
    }
}
