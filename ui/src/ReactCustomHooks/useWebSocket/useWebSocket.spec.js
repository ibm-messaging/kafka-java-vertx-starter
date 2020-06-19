import { returnMockSocket, renderHook, act } from 'TestUtils';
import { useWebSocket, STATUS } from '../index.js';

describe(`useWebSocket hook`, () => {
  let mockWebSocket,
    getSocketEventHandler,
    triggerEvent,
    mockEventListener,
    handlers,
    consoleErrorStub;

  const baseHandlers = () => ({
    onOpen: jest.fn(),
    onMessage: jest.fn(),
    onError: jest.fn(),
    onClose: jest.fn(),
  });

  const mountHook = (testSocket, handlers = baseHandlers()) =>
    renderHook(() =>
      useWebSocket(() => testSocket, {
        ...handlers,
      })
    );

  beforeEach(() => {
    handlers = baseHandlers();
    const mockWebSocketForTest = returnMockSocket();
    mockWebSocket = mockWebSocketForTest.getSocket();
    mockEventListener = mockWebSocketForTest.getAddEventListener();
    triggerEvent = mockWebSocketForTest.triggerEvent;
    getSocketEventHandler = mockWebSocketForTest.getSocketEvent;
    consoleErrorStub = jest
      .spyOn(console, 'error')
      .mockImplementation(() => false);
  });

  afterEach(() => {
    consoleErrorStub.mockRestore();
  });

  it('does nothing if argument one is not a function', () => {
    const { getResultFromHook } = renderHook(() => useWebSocket(undefined, {}));
    let { send, currentState } = getResultFromHook();
    // confirm externals as expected - tell the user invalid input provided
    expect(send).toBeDefined();
    expect(currentState).toBeDefined();
    expect(currentState).toEqual(STATUS.INVALID);
  });
  it('provides the user with the expected websocket starting state and externals', () => {
    const { getResultFromHook } = mountHook(mockWebSocket, handlers);

    let { send, currentState } = getResultFromHook();

    // confirm externals as expected
    expect(send).toBeDefined();
    expect(currentState).toBeDefined();
    expect(currentState).toEqual(STATUS.CONNECTING);
    // confirm the mock socket has had a request add an event on open
    expect(mockEventListener).toBeCalledTimes(4); // once for each event type
    expect(mockEventListener).toHaveBeenNthCalledWith(
      1,
      'open',
      expect.any(Function)
    );
  });

  it('correctly reports state to the user as the socket connection is established', () => {
    const { getResultFromHook } = mountHook(mockWebSocket, handlers);

    // confirm our handler hasnt been called yet, as the socket hasnt opened
    expect(handlers.onOpen).toBeCalledTimes(0);
    expect(getSocketEventHandler('open')).toBeCalledTimes(0);

    act(() => {
      triggerEvent('open'); // simulate the socket opening
    });

    let { currentState } = getResultFromHook();

    // confirm our handler was called
    expect(getSocketEventHandler('open')).toBeCalledTimes(1);
    expect(handlers.onOpen).toBeCalledTimes(1);
    expect(currentState).toEqual(STATUS.OPEN); // now should be open
  });

  it('binds a default set of handlers if none are provided by the user, allowing the hook to still function', () => {
    const { getResultFromHook } = renderHook(() =>
      useWebSocket(() => mockWebSocket)
    );
    // validate, even though we provided no handlers, some have been registered
    expect(mockEventListener).toBeCalledTimes(4); // once for each event type
    // simulate a call to each. As we have bound nothing, we cannot observe a
    // change directly - but the intent is to confirm the code doesnt fail
    // error and acts as it would if handlers had been provided
    act(() => {
      triggerEvent('open');
    });
    expect(getResultFromHook('currentState')).toEqual(STATUS.OPEN); // the hook was able to complete/handle the event as normal
    act(() => {
      triggerEvent('message'); // nothing to observe
    });
    act(() => {
      triggerEvent('error', true); // check default error handler invoked
    });
    expect(consoleErrorStub).toHaveBeenCalledTimes(2);
    expect(consoleErrorStub).toHaveBeenNthCalledWith(
      1,
      `Unhandled error: true`
    );
    expect(consoleErrorStub).toHaveBeenNthCalledWith(
      2,
      `Please register 'onError' event handler on creation of hook`
    );
    act(() => {
      triggerEvent('close');
    });
    expect(getResultFromHook('currentState')).toEqual(STATUS.CLOSED); // the hook was able to complete/handle the event as normal
  });

  it('correctly binds user provided event socket events', () => {
    mountHook(mockWebSocket, handlers);
    // trigger the supported handlers, validate the are called with expected value(s)
    [
      {
        type: 'open',
        eventArgs: undefined,
        handler: handlers.onOpen,
        calledWith: [],
      },
      {
        type: 'message',
        eventArgs: { msg: 'foo' },
        handler: handlers.onMessage,
        calledWith: [{ msg: 'foo' }],
      },
      {
        type: 'error',
        eventArgs: false,
        handler: handlers.onError,
        calledWith: [false],
      },
      {
        type: 'close',
        eventArgs: undefined,
        handler: handlers.onClose,
        calledWith: [],
      },
    ].forEach(({ type, eventArgs, handler, calledWith }) => {
      expect(handler).toHaveBeenCalledTimes(0);
      act(() => {
        triggerEvent(type, eventArgs); // simulate the socket event
      });
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(...calledWith);
    });
  });

  it('allows a user to send messages when the socket is open, and in other cases, return the expected response', () => {
    const { getResultFromHook } = mountHook(mockWebSocket, handlers);
    const mockMessage = 'foo';
    let send = getResultFromHook('send');
    let sendResult;

    expect(getResultFromHook('currentState')).toEqual(STATUS.CONNECTING); // user should now be told it is opening state to start

    // in this case, of we try and use the
    sendResult = send(mockMessage);
    expect(mockWebSocket.send).toHaveBeenCalledTimes(0); // no send to socket
    expect(sendResult).toBe(false); // nothing sent
    // confirm error is printed
    expect(consoleErrorStub).toHaveBeenCalledTimes(1);
    expect(consoleErrorStub).toHaveBeenLastCalledWith('Socket is not open');

    act(() => {
      triggerEvent('open'); // simulate the socket opening
    });

    expect(getResultFromHook('currentState')).toEqual(STATUS.OPEN); // user should now be told it is open
    send = getResultFromHook('send');
    sendResult = send(mockMessage);
    expect(mockWebSocket.send).toHaveBeenCalledTimes(1); // socket send invoked
    expect(mockWebSocket.send).toHaveBeenCalledWith(mockMessage);
    expect(sendResult).toBe(true); // sent was called

    act(() => {
      triggerEvent('close'); // simulate the socket closing (for whatever reason)
    });

    expect(getResultFromHook('currentState')).toEqual(STATUS.CLOSED); // user should now be told it is closed

    send = getResultFromHook('send');
    sendResult = send(mockMessage);
    expect(mockWebSocket.send).toHaveBeenCalledTimes(1); // no new send to socket
    expect(sendResult).toBe(false); // nothing sent
    // confirm error is printed
    expect(consoleErrorStub).toHaveBeenCalledTimes(2);
    expect(consoleErrorStub).toHaveBeenLastCalledWith('Socket is not open');
  });

  it('on unmount closes the websocket as intended', () => {
    const { unmount, getResultFromHook } = mountHook(mockWebSocket, handlers);

    // confirm all event handlers have been registered
    expect(mockEventListener).toBeCalledTimes(4); // once for each event type
    expect(mockEventListener).toHaveBeenNthCalledWith(
      4,
      'close',
      expect.any(Function)
    ); // and one was close

    act(() => {
      triggerEvent('open'); // simulate the socket opening so we have a live socket for test purposes
    });

    expect(getResultFromHook('currentState')).toEqual(STATUS.OPEN); // should now be in open state

    act(() => {
      unmount(); // unmount
    });

    // confirm the close had been triggered. As the hook is unmounted, all other states are no longer available
    expect(mockWebSocket.close).toBeCalledTimes(1);
  });
});
