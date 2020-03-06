package kafka.vertx.demo.consumer;

public class DemoConsumedRecord {

  private final String topic;
  private final int partition;
  private final long offset;
  private final String value;
  private final long timestamp;

  public DemoConsumedRecord(String topic, int partition, long offset, String value, long timestamp) {
    this.topic = topic;
    this.partition = partition;
    this.offset = offset;
    this.value = value;
    this.timestamp = timestamp;
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

  public String getValue() {
    return value;
  }

  public long getTimestamp() {
    return timestamp;
  }

  @Override
  public String toString() {
    final StringBuilder sb = new StringBuilder("DemoConsumedRecord{");
    sb.append("topic=").append(topic);
    sb.append(", partition='").append(partition).append('\'');
    sb.append(", offset='").append(offset).append('\'');
    sb.append(", value='").append(value).append('\'');
    sb.append(", timestamp='").append(timestamp).append('\'');
    sb.append('}');
    return sb.toString();
  }
}
