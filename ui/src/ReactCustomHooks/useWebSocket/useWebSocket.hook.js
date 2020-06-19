import { useState, useEffect } from 'react';
import { NO_OP, EMPTY_OBJ } from 'Utils';

const STATUS = {
  CONNECTING: WebSocket.CONNECTING,
  OPEN: WebSocket.OPEN,
  CLOSING: WebSocket.CLOSING,
  CLOSED: WebSocket.CLOSED,
  INVALID: 'Invalid WebSocket function provided. See documentation',
  SENT: true,
  NOT_SENT: false,
};

const SOCKET_NOT_OPEN_HANDLER = () => {
  // eslint-disable-next-line no-console
  console.error('Socket is not open');
  return STATUS.NOT_SENT;
};

const DEFAULT_STATE = {
  send: SOCKET_NOT_OPEN_HANDLER,
  currentState: STATUS.CLOSED,
};

const openWebSocket = (
  getWebsocket,
  { onOpen = NO_OP, onMessage = NO_OP, onError, onClose = NO_OP },
  socketState,
  updateSocketState
) => {
  let closeSocket = NO_OP;

  if (
    typeof getWebsocket === 'function' &&
    socketState.currentState !== WebSocket.OPEN
  ) {
    const socket = getWebsocket();

    closeSocket = () => {
      socket.close(); //trigger the close of our socket
      updateSocketState({ ...socketState, currentState: STATUS.CLOSING });
    };

    socket.addEventListener('open', () => {
      updateSocketState({
        send: (...args) => {
          socket.send(...args);
          return STATUS.SENT;
        }, // call send and return sent response
        currentState: STATUS.OPEN,
      });
      onOpen();
    });

    socket.addEventListener('message', onMessage);
    socket.addEventListener('error', (error) => {
      // if we have a user provided error handler, use that, else default
      if (typeof onError === 'function') {
        onError(error);
      } else {
        // eslint-disable-next-line no-console
        console.error(`Unhandled error: ${error}`);
        // eslint-disable-next-line no-console
        console.error(
          `Please register 'onError' event handler on creation of hook`
        );
      }
    });
    // used in cases such as the backend hanging up etc - update our state to
    // match
    socket.addEventListener('close', () => {
      updateSocketState({
        ...socketState,
        send: SOCKET_NOT_OPEN_HANDLER, // change send function to the no op version
        currentState: STATUS.CLOSED,
      });
      onClose();
    });

    updateSocketState({
      ...socketState,
      close: closeSocket,
      currentState: STATUS.CONNECTING,
    });
  } else {
    updateSocketState({
      ...socketState,
      currentState: STATUS.INVALID,
    });
  }
  return closeSocket;
};
const useWebSocket = (getWebsocket, handlers = EMPTY_OBJ) => {
  let [socketState, updateSocketState] = useState(DEFAULT_STATE);
  const { send, currentState } = socketState;

  useEffect(() => {
    const closeSocket = openWebSocket(
      getWebsocket,
      handlers,
      socketState,
      updateSocketState
    );
    return closeSocket; // will be called on unmount
  }, []); // only run on first render

  return {
    send,
    currentState,
  };
};

export { useWebSocket, STATUS };
