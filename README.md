# Starter Vert.x Kafka app

A starter app for testing out your [Apache Kafka](https://kafka.apache.org) deployment and trying out the [Vert.x Kafka client](https://vertx.io/docs/vertx-kafka-client/java/).

The app allows you to send records to a topic in Kafka called `demo` every two seconds and consume back those records.

## Running the app

Test out the app by connecting to the websocket endpoints (UI will be added soon!):

 - Make sure Kafka is running locally. (You can use the [quickstart guide](https://kafka.apache.org/quickstart))
 - Build the app: `mvn package`
 - Start the app: `java -jar target/demo-all.jar`
 - Connect to `http://localhost:8080/` to view the UI
 - Use the buttons in the UI to produce and consume records

## Configuration

To configure the application to connect to your Kafka edit the properties file called `kafka.properties`.
Alternatively you can provide a custom path to the properties file using `-Dproperties_path=<path>` when starting the application.

If your Kafka is secured you will need to enable the security configuration options in your properties file.

To increase the logging level to debug provide a system property at start time: `-Dlog.level=debug`.

To increase the Kafka client logging level to info provide a system property at start time: `-Dlog.level.kafka=info`.

## Build prerequisites

To build this project you will need:

- [Maven `mvn`](https://maven.apache.org/)
- [npm version 6.4.1 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [node 10.15.0 or later](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Java 8 or Java 11](https://adoptopenjdk.net)

## Tool Configuration

This repo makes use of [Netlify](https://www.netlify.com/) and [Dependabot](https://dependabot.com/).

### Netlify

We use Netlify to show previews of Storybooks when a change is made to the UI. This is so we can see the changes without having to worry about pulling down every branch. The configuration for this lives in `netlify.toml`. This specifies how to build a Storybook and the project folder the UI lives in.

### Dependabot

We use Dependabot to make sure we are always keeping our Node and Maven dependencies as up to date as possible. The configuration for this lives in `.dependabot/config.yml`. This describes how often we want our dependencies updates and certain restrictions such as the number of pull requests the bot can make at any one time.

