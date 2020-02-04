package kafka.vertx.demo.producer;

public class RecordData {
    private String topic;
    private int partition;
    private long offset;
    private long timestamp;

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
        this.status = status;
        this.topic = topic;
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
