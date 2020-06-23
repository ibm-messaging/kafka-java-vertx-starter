# Starter Vert.x Kafka app

A starter app for testing out your [Apache Kafka](https://kafka.apache.org) deployment and trying out the [Vert.x Kafka client](https://vertx.io/docs/vertx-kafka-client/java/).

The app allows you to send records to a topic in Kafka called `demo` every two seconds and consume back those records.

## Running the app

Test out the app by connecting to the websocket endpoints (UI will be added soon!):

 - Make sure Kafka is running locally. (You can use the [quickstart guide](https://kafka.apache.org/quickstart))
 - Build the app: `mvn install`
 - Start the app: `java -jar target/demo-0.0.2-SNAPSHOT-all.jar`
 - Connect to `ws://localhost:8080/demoproduce` (e.g., using [websocat](https://github.com/vi/websocat))
 - Start sending records to Kafka by sending the following message to the websocket:
    ```
    {"action":"start"}
    ```
    The websocket will receive notifications every time the app sends a new record to Kafka.
 - Stop sending records by sending the following message to the websocket:
    ```
   {"action":"stop"}
   ```
 - Disconnect from the produce websocket
 - Connect to `ws://localhost:8080/democonsume`
 - Start consuming from Kafka by sending the following message to the websocket:
    ```
    {"action":"start"}
    ```
   The websocket will receive information about all the consumed records.
 - Stop consuming records by sending the following message to the websocket:
    ```
   {"action":"stop"}
   ```
 - Disconnect from the consume websocket

## Configuration
To configure the application to connect to your Kafka edit the properties file called `kafka.properties`.
Alternatively you can provide a custom path to the properties file using `-Dproperties_path=<path>` when starting the application.

If your Kafka is secured you will need to enable the security configuration options in your properties file.

To increase the logging level to debug provide a system property at start time: `-Dlog.level=debug`.

To increase the Kafka client logging level to info provide a system property at start time: `-Dlog.level.kafka=info`.
