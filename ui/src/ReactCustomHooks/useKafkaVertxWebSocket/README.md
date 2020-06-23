# useKafkaVertxWebSocket

This hook integrates the front and backend of the starter application by 
owning, altering and reporting on changes of backend state via a
Websocket.

In its current form, the backend expects one of two messages from the UI to
start either the Kafka producer or consumer or stop them. When running, the
backend will send messages whenever a new record is produced or consumed,
until the UI sends a stop request. This hook handles all of the above, and will
return a sanatised set of message data, along with metadata and counts for the
user of this hook to then render or use.

The hook also encapsulates performance buffering, and a configurable maximum
message set to persist at any one time.

This hook uses [`useWebSocket`](../useWebSocket/README.md) to manage the 
WebSocket.

## Usage

This hook is used and returns as follows:

```
const {
    start,
    stop,
    metadata,
    messages,
    totalSuccessMessages,
    totalErrorMessages,
    } = useKafkaVertxWebSocket(
        getWebsocket,
        maxBuffer,
        bufferDebouceTimeout,
        defaultStartContent,
    );
```

Where returned values are:

- `start` - function which sends the 'start' message. Takes one parameter, an
object, which is spread alongside the start command so it is sent as a part of
the same request
- `stop` - function that sends the 'stop' message
- `metadata` - object - metadata about this connection, including the topic 
being produced/consumed from
- `messages` - array - the current set of stored messages
- `totalSuccessMessages` - the grand total of success messages over the life of
this socket
- `totalErrorMessages` - the grand total of error messages over the life of 
this socket

and provided values to the hook are:

- `getWebsocket` - function - should return a WebSocket ([as per](../useWebSocket/README.md#usage)).
- `maxMessageNumber` - Integer - the maximum number of records to persist - 
default 300
- `bufferDebouceTimeout` - Integer - time in ms between buffer flushes - 
default 1000 (1 second)
- `defaultStartContent` - object - [see this for details on usage](#on-start)

The content of the `messages` array will be as follows:

```
    {
        status: 'SUCCESS',
        index: 119,
        topic: 'mock_topic',
        partition: 0,
        offset: 1950,
        timestamp: 1592574474110,
        value: 'Content!'
    }
```

where:

- `status` is the produce/consume status. Either 'SUCCESS' or 'FAILURE'
- `index` is the id for this message. This is a count, starting at one, 
increasing by one for each new message recieved for the lifetime of the hook
- `topic` is the topic being interacted with
- `partition` is the partition ID
- `offset` is the offset ID for this record
- `timestamp`is the time, in ms, from epoch
- `value` is the content of the record, either just produced or consumed

In the case of an error, the `status` and `index` keys will always be returned,
as well as any information returned from the backend.

### On start

On the backend, both producer and consumer Vertx processes are started and 
stopped via start and stop commands. However, in the case of the producer, the
start command also expects a `custom` value - which is the content of any 
produced Kafka offsets. To this end, `defaultStartContent` could be used to
provide a shape such as this:

```
    {
        custom: 'Hello world'
    }
```

which when sent to the backend on all calls to start as follows:

```
    {
        custom: 'Hello world',
        action: 'start',
    }
```

This could then be overriden later by providing a parameter to the returned
`start` function from the hook:

`start({content: 'Foo'})`

would result in a call to the backend of:

```
    {
        custom: 'Foo',
        action: 'start',
    }

```

Alternatively, in the case of a consumer, `defaultStartContent` and `start` can
be set/called with no values, and just the following will be sent:

```
    {
        action: 'start',
    }
```