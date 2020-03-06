package kafka.vertx.demo.producer;

import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.kafka.client.producer.KafkaProducer;
import io.vertx.kafka.client.producer.KafkaProducerRecord;
import io.vertx.kafka.client.producer.RecordMetadata;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

public class ProducerServiceImpl implements ProducerService {

    private KafkaProducer<String, String> producer;

    private static final Logger logger = LoggerFactory.getLogger(ProducerServiceImpl.class);

    public ProducerServiceImpl(Vertx vertx, Map<String, String> config) {
        producer = KafkaProducer.create(vertx, config);
        producer.exceptionHandler(t -> logger.error("KafkaProducer Exception", t));
    }

    @Override
    public void produce(String topic, String message, Handler<AsyncResult<RecordMetadata>> resultHandler) {
        KafkaProducerRecord<String, String> record = KafkaProducerRecord.create(topic, message);
        producer.send(record, resultHandler);
    }
}
