# Mock Websocket

This is a mock Websocket implementation which emulates a Starter App backend.
It is intended for use by both storybook and in testing, and exposes two
functions to enable both use cases. The data returned is of the correct shape,
but the values will be random/not contextual.

- `controlledWebsocket` - to be used under test. Allows direct access and
control of the status of a Websocket, and to send success and error responses
as needed.
- `storybookWebsocket` - to be used by Storybook. Drives `controlledWebsocket`, 
but adds timers and intervals to emulate a backend sending data. Ensure that 
any usage of this is behind a function, else the timers may effect other parts
of the code, ie:

```
const mySocket = () =>
  storybookWebsocket(CONSTANTS.CONSUMER);
```

Both functions take parameters to customise their behaviour. See the code for 
details.