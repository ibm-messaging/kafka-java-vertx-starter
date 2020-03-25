/*
(C) Copyright IBM Corp. 2020  All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package kafka.vertx.demo.producer;

public class RecordData {
  private final String topic;
  private final int partition;
  private final long offset;
  private final long timestamp;

  public enum Status {
    DELIVERED, ERROR
  }

  private Status status;

  public RecordData(Status status, String topic, int partition, long offset, long timestamp) {
    this.status = status;
    this.topic = topic;
    this.partition = partition;
    this.offset = offset;
    this.timestamp = timestamp;
  }

  public RecordData(Status status, String topic) {
    this(status, topic, 0, 0L, 0L);
  }

  public Status getStatus() {
    return status;
  }

  public String getTopic() {
    return topic;
  }

  public int getPartition() {
    return partition;
  }

  public long getOffset() {
    return offset;
  }

  public long getTimestamp() {
    return timestamp;
  }
}
