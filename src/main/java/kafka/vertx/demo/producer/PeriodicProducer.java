/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.producer;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.TimeUnit;

public class PeriodicProducer extends AbstractVerticle {

    private String topicName;
    private String message;
    private String eventBusId;

    private static final Logger logger = LoggerFactory.getLogger(PeriodicProducer.class);

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
            logger.error("Failure in producing record", t);
            return null;
        })));
    }
}
