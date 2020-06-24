# Consumer

The Consumer panel represents the backend consumer in the starter application.
It show the user a summary of current consumption state, as well as the latest
30 messages which were consumed. In also will the user to interact with the
backend by offering the ability to start and stop the backend consumer.

# Usage

The Consumer acts as a panel. As such, the properties expected are as follows:

- getConsumerWebsocket - required - a function which returns a Websocket object
which is configured to connect to the backend consumer.
- topic - required - the name of the topic being consumed from.
- maxNumberOfMessages - the max number of messages to render. Defaults to 30.

# Behaviours

The behaviours and capabilities of this component are captured in it's 
[feature file](./Consumer.feature).