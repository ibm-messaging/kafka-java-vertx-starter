package kafka.vertx.demo.producer;

import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;
import io.vertx.kafka.client.producer.RecordMetadata;

@ProxyGen
public interface ProducerService {

  static ProducerService createProxy(Vertx vertx, String address) {
    return new ProducerServiceVertxEBProxy(vertx, address);
  }

  void produce(String topic, String message, Handler<AsyncResult<RecordMetadata>> resultHandler);

}
