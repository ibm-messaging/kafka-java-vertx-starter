import { NO_OP } from 'Utils';

const returnMockSocket = ({
  open = NO_OP,
  close = NO_OP,
  message = NO_OP,
  error = NO_OP,
} = {}) => {
  let userSocketEvents = {
    open: jest.fn().mockImplementation(open),
    close: jest.fn().mockImplementation(close),
    message: jest.fn().mockImplementation(message),
    error: jest.fn().mockImplementation(error),
  };

  const addToEventMap = (key, handler) => {
    userSocketEvents = {
      ...userSocketEvents,
      [key]: jest.fn().mockImplementation(handler),
    };
  };

  const socket = {
    addEventListener: jest.fn().mockImplementation(addToEventMap),
    close: jest.fn(),
    send: jest.fn(),
  };

  return {
    getSocket: () => socket,
    getAddEventListener: () => socket.addEventListener,
    triggerEvent: (event, ...args) => userSocketEvents[event](...args),
    getSocketEvent: (event) => userSocketEvents[event],
  };
};

export { returnMockSocket };
