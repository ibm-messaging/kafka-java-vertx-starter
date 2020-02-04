package kafka.vertx.demo.producer;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;

import java.util.concurrent.TimeUnit;

public class PeriodicProducer extends AbstractVerticle {

    private String topicName;
    private String message;
    private String eventBusId;

    public PeriodicProducer(String topicName, String message, String eventBusId) {
        this.topicName = topicName;
        this.message = message;
        this.eventBusId = eventBusId;
    }

    //Function to enable producer to regularly produce a record to the Kafka topic every 2 seconds
    @Override
    public void start() {
        ProducerService producerService = ProducerService.createProxy(vertx, ProducerVerticle.ADDRESS);
        vertx.setPeriodic(TimeUnit.SECONDS.toMillis(2), id -> producerService.produce(topicName, message, res -> res.map(record -> {
            RecordData recordData = new RecordData(RecordData.Status.DELIVERED, record.getTopic(), record.getPartition(), record.getOffset(), record.getTimestamp());
            vertx.eventBus().send(eventBusId, JsonObject.mapFrom(recordData).encode());
            return null;
        }).otherwise(t -> {
            System.out.printf("Failure in producing record: %s%n", t);
            return null;
        })));
    }
}
