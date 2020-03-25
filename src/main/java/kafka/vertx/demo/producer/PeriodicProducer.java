/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.producer;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonObject;
import io.vertx.kafka.client.producer.RecordMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    vertx.setPeriodic(2000, id -> producerService.produce(topicName, message, res -> {
      if (res.succeeded()) {
        RecordMetadata record = res.result();
        RecordData recordData = new RecordData(RecordData.Status.DELIVERED, record.getTopic(), record.getPartition(), record.getOffset(), record.getTimestamp());
        vertx.eventBus().send(eventBusId, JsonObject.mapFrom(recordData).encode());
      } else {
        logger.error("Failure in producing record", res.cause());
      }
    }));
  }
}
