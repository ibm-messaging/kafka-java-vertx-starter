/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.producer;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;
import io.vertx.kafka.client.producer.RecordMetadata;

import java.util.Map;

public class ProducerServiceImpl implements ProducerService{

    private KafkaProducer<String, String> producer;

    public ProducerServiceImpl(Vertx vertx, Map<String, String> config) {
        producer = KafkaProducer.create(vertx, config);
        producer.exceptionHandler(t -> System.out.printf("KafkaProducer Exception: %s%n", t));
    }

    @Override
    public void produce(String topic, String message, Handler<AsyncResult<RecordMetadata>> resultHandler) {
        KafkaProducerRecord<String, String> record = KafkaProducerRecord.create(topic, message);
        producer.send(record, resultHandler);
    }
}
