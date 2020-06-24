import { returnMockSocket, mountHook, act, useFakeTimers } from 'TestUtils';
import { useKafkaVertxWebSocket } from '../index.js';
import { CONSTANTS } from 'Utils';

describe('useKafkaVertxWebSocket hook', () => {
  let mockSocketHelper,
    mockSocket,
    mockSocketFn,
    recieveMessage,
    fakeTime,
    consoleErrorStub,
    consoleDirStub;

  const debounceTimer = 1001;

  beforeEach(() => {
    mockSocketHelper = returnMockSocket();
    mockSocket = mockSocketHelper.getSocket();
    mockSocketFn = () => mockSocket;
    recieveMessage = (msg) =>
      mockSocketHelper.triggerEvent('message', { data: JSON.stringify(msg) });
    fakeTime = useFakeTimers(); // time minipulation via sinon, as lodash requires it
    consoleErrorStub = jest
      .spyOn(console, 'error')
      .mockImplementation(() => false);
    consoleDirStub = jest.spyOn(console, 'dir').mockImplementation(() => false);
  });

  afterEach(() => {
    consoleErrorStub.mockRestore();
    consoleDirStub.mockRestore();
    fakeTime.restore();
  });

  it('returns the expected externals on mount with required parameters', () => {
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );
    const {
      start,
      stop,
      isReady,
      isRunning,
      metadata,
      messages,
      totalSuccessMessages,
      totalErrorMessages,
    } = getResultFromHook();

    expect(start).toBeDefined();
    expect(start).toEqual(expect.any(Function));
    expect(stop).toBeDefined();
    expect(stop).toEqual(expect.any(Function));
    expect(isReady).toBeDefined();
    expect(isReady).toBe(false);
    expect(isRunning).toBeDefined();
    expect(isRunning).toBe(false);
    expect(metadata).toBeDefined();
    expect(metadata).toEqual({});
    expect(messages).toBeDefined();
    expect(messages).toEqual([]);
    expect(totalSuccessMessages).toBeDefined();
    expect(totalSuccessMessages).toEqual(0);
    expect(totalErrorMessages).toBeDefined();
    expect(totalErrorMessages).toEqual(0);
  });

  it('does not send messages to the backend until it is ready', () => {
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );
    let { start, stop, isReady, isRunning } = getResultFromHook();

    expect(start).toBeDefined();
    expect(start).toEqual(expect.any(Function));
    expect(stop).toBeDefined();
    expect(stop).toEqual(expect.any(Function));
    expect(isReady).toBeDefined();
    expect(isReady).toBe(false);
    expect(isRunning).toBeDefined();
    expect(isRunning).toBe(false);

    act(() => {
      start();
      stop();
    });
    // nothing will happen as the backend is not ready
    expect(mockSocket.send).toHaveBeenCalledTimes(0);

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });

    start = getResultFromHook('start');
    stop = getResultFromHook('stop');
    isReady = getResultFromHook('isReady');
    isRunning = getResultFromHook('isRunning');

    expect(isReady).toBe(true); // confirm we are ready, but not runing yet
    expect(isRunning).toBe(false);

    act(() => {
      start(); // start
    });

    start = getResultFromHook('start');
    stop = getResultFromHook('stop');
    isReady = getResultFromHook('isReady');
    isRunning = getResultFromHook('isRunning');

    // confirm we are running, and that the socket was passed data
    expect(isReady).toBe(true);
    expect(isRunning).toBe(true);
    expect(mockSocket.send).toHaveBeenCalledTimes(1);
    expect(mockSocket.send).toHaveBeenLastCalledWith(
      JSON.stringify({ action: 'start' })
    );

    act(() => {
      stop();
    });

    start = getResultFromHook('start');
    stop = getResultFromHook('stop');
    isReady = getResultFromHook('isReady');
    isRunning = getResultFromHook('isRunning');

    expect(isReady).toBe(true); // confirm we are ready, but not running again
    expect(isRunning).toBe(false);
    expect(mockSocket.send).toHaveBeenCalledTimes(2);
    expect(mockSocket.send).toHaveBeenLastCalledWith(
      JSON.stringify({ action: 'stop' })
    );
  });

  it('can be provided with a custom payload to send as a part of the start request', () => {
    const customContent = { foo: 'bar' };
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn,
      5,
      5,
      customContent
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start
      start();
    });
    // expect send was called with expected values
    expect(mockSocket.send).toHaveBeenCalledTimes(1);
    expect(mockSocket.send).toHaveBeenLastCalledWith(
      JSON.stringify({ ...customContent, action: 'start' })
    );
  });

  it('can be provided with a custom payload to send as a part of the start request, and have that content overidden when calling start()', () => {
    const customContent = { foo: 'bar', tlou: 1 };
    const startContent = { tlou: 2 };
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn,
      5,
      5,
      customContent
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start
      start(startContent);
    });
    // expect send was called with expected values
    expect(mockSocket.send).toHaveBeenCalledTimes(1);
    expect(mockSocket.send).toHaveBeenLastCalledWith(
      JSON.stringify({ ...customContent, ...startContent, action: 'start' })
    );
  });

  it('handles unexpected/unparsable message events as expected', () => {
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start and provide something unexpected
      start();
      mockSocketHelper.triggerEvent('message', { data: 'not valid json' });
      fakeTime.tick(debounceTimer);
    });

    let {
      metadata,
      messages,
      totalSuccessMessages,
      totalErrorMessages,
    } = getResultFromHook();

    // expect no change in externals

    expect(metadata).toEqual({});
    expect(messages).toEqual([]);
    expect(totalSuccessMessages).toEqual(0);
    expect(totalErrorMessages).toEqual(0);

    // but that error handling logic has fired
    expect(consoleErrorStub).toHaveBeenCalledTimes(1);
    expect(consoleErrorStub).toHaveBeenNthCalledWith(
      1,
      `Error occured while parsing onMessageResponse. Error was:`
    );
    expect(consoleDirStub).toHaveBeenCalledTimes(1);
    expect(consoleDirStub).toHaveBeenNthCalledWith(1, expect.any(Error));
  });

  it('handles empty message events as expected, setting metadata data as well as other external returned values as expected', () => {
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start and provide nothing
      start();
      recieveMessage();
      fakeTime.tick(debounceTimer);
    });

    let {
      metadata,
      messages,
      totalSuccessMessages,
      totalErrorMessages,
    } = getResultFromHook();

    expect(metadata).toEqual({});
    expect(messages).toEqual([]);
    expect(totalSuccessMessages).toEqual(0);
    expect(totalErrorMessages).toEqual(0);
  });

  it('handles metadata message events as expected, setting metadata data as well as other external returned values as expected', () => {
    const metadataShape = {
      tickRate: 100,
      producerStarted: true,
    };
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start and 'receive' a metadata shape
      start();
      recieveMessage(metadataShape);
      fakeTime.tick(debounceTimer);
    });

    let {
      metadata,
      messages,
      totalSuccessMessages,
      totalErrorMessages,
    } = getResultFromHook();

    expect(metadata).toEqual(metadataShape);
    expect(messages).toEqual([]);
    expect(totalSuccessMessages).toEqual(0);
    expect(totalErrorMessages).toEqual(0);
  });

  it('handles data message events as expected, setting messages data as well as other external returned values as expected', () => {
    const dataShape = {
      topic: 'mock_topic',
      partition: 0,
      offset: 1950,
      timestamp: 1592574474110,
      value: 'Content!',
    };
    const expectedMessageShape = {
      status: CONSTANTS.VERTX_SUCCESS_STATUS,
      index: 1,
      ...dataShape,
    };
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start and 'receive' a record shape
      start();
      recieveMessage(dataShape);
      fakeTime.tick(debounceTimer);
    });

    let {
      metadata,
      messages,
      totalSuccessMessages,
      totalErrorMessages,
    } = getResultFromHook();

    expect(metadata).toEqual({});
    expect(messages).toEqual([expectedMessageShape]);
    expect(totalSuccessMessages).toEqual(1);
    expect(totalErrorMessages).toEqual(0);
  });

  it('handles data message events as expected, and will discard old message data if configured to do so, while maintaining counts', () => {
    const successDataShape = {
      topic: 'mock_topic',
      partition: 0,
      offset: 1950,
      timestamp: 1592574474110,
      value: 'Content!',
    };
    const errorDataShape = {
      status: CONSTANTS.VERTX_ERROR_STATUS,
    };

    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn,
      2
    ); // max two messages

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // start and 'receive' a few record shapes
      start();
      recieveMessage(successDataShape);
      recieveMessage(errorDataShape);
      recieveMessage(successDataShape);
      fakeTime.tick(debounceTimer);
    });

    let {
      metadata,
      messages,
      totalSuccessMessages,
      totalErrorMessages,
    } = getResultFromHook();

    expect(metadata).toEqual({});
    // newest first
    expect(messages).toEqual([
      {
        status: CONSTANTS.VERTX_SUCCESS_STATUS,
        index: 3,
        ...successDataShape,
      },
      {
        status: CONSTANTS.VERTX_ERROR_STATUS,
        index: 2,
      },
    ]);
    expect(totalSuccessMessages).toEqual(2);
    expect(totalErrorMessages).toEqual(1);
  });

  it('handles close events from the socket/backend, and updates externals', () => {
    const { getResultFromHook } = mountHook(
      useKafkaVertxWebSocket,
      mockSocketFn
    );

    act(() => {
      // trigger the socket to be open, as if the backend was now available
      mockSocketHelper.triggerEvent('open');
    });
    let { start } = getResultFromHook();
    act(() => {
      // trigger a start
      start();
    });

    let { isReady, isRunning } = getResultFromHook();

    // expect state externals to be updated to open/ready

    expect(isReady).toEqual(true);
    expect(isRunning).toEqual(true);

    act(() => {
      // trigger the close from the socket
      mockSocketHelper.triggerEvent('close');
    });

    // and that externals have been updated
    expect(getResultFromHook('isReady')).toEqual(false);
    expect(getResultFromHook('isRunning')).toEqual(false);
  });
});
