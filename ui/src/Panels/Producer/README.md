# Producer

The Producer panel represents the backend producer in the starter application.
It shows the user a summary of current production state, as well as the latest
5 messages which were produced. It allows the user to set a custom message value
and also allows the user to interact with the backend by offering the ability
to start and stop the backend producer.

# Usage

The Producer acts as a panel. As such, the properties expected are as follows:

- getProducerWebsocket - required - a function which returns a Websocket object
which is configured to connect to the backend producer.
- topic - required - the name of the topic being produced from.
- maxNumberOfMessages - the max number of messages to render. Defaults to 5.

# Behaviours

The behaviours and capabilities of this component are captured in it's
[feature file](./Producer.feature).
