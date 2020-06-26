# WebSocketHook

This hook in an abstraction of the [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

This hook will manage the opening and closing of the websocket when the 
component using this hook mounts and unmounts. It also will manage the 
websocket through it's lifecycle, and will call through to provided 
callbacks as events occur.

It will return a function which will allow the sending of data (when 
the websocket allows), and the current status if the websocket.

Details on the usage can be found below. Finally, a set of websocket 
states are also exported alongside the hook, under the name `STATUS`.

## Usage

Create a new websocket:

```
const { send, currentState } = useWebSocket(
  func() => WebSocket,
  {
    onError: func(error),
    onClose: func(),
    onOpen: func(),
    onMessage: func(message),
  }
);
```

Where `onError`, `onClose`, `onOpen`, `onMessage` are direct mappings of the
WebSocket events. For flexibility and composability, the first argument 
provided to the hook should be a function which, on call, will return a new 
pre-configured websocket. This allows the user control over items such as 
the protocol to use, as well as the endpoint to connect to.

The returned values are `send` and `currentState`. `send` is a direct mapping
to the Websocket's `send` function, and parameters are passed directly to it.
Do note however that the websocket `send` function will only be invoked if
the socket is open. To this end, a boolean value will be returned, to indicate
if the call was completed or not (`false` = no, `true` = yes). 

`currentState` is the state of the websocket. This is provided for 
informational purposes to the user. The values for the various states are
exposed in the `STATUS` export, and could be used as follows:

```
if (currentState === STATUS.OPEN) {
  send(message);
}
```

The provided `STATUS` state values are as follows:

- `CONNECTING` - websocket is connecting to backend
- `OPEN` - websocket connected and ready for work
- `CLOSING` - websocket is in process of closing
- `CLOSED` - websocket has been closed
- `INVALID` - invalid input provided when hook was created
- `SENT` - requested message sent
- `NOT_SENT` - requested message not sent, as the websocket was closed