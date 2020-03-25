/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.consumer;

import io.vertx.codegen.annotations.ProxyGen;
import io.vertx.core.AsyncResult;
import io.vertx.core.Handler;
import io.vertx.core.Vertx;

@ProxyGen
public interface ConsumerService {

  static ConsumerService createProxy(Vertx vertx, String address) {
    return new ConsumerServiceVertxEBProxy(vertx, address);
  }

  void subscribe(String topicName, String eventBusId, Handler<AsyncResult<Void>> resultHandler);

  void pause(String topicName, Handler<AsyncResult<Void>> resultHandler);

}
