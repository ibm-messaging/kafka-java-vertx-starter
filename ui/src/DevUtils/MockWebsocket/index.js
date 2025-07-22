/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// used in storybook/tests to emulate a socket/the backend behind it
import { CONSTANTS, NO_OP } from 'Utils';

const successShape = (offset = 0, custom = 'Storybook!') => ({
  topic: 'my_topic',
  partition: 0,
  offset,
  timestamp: Date.now(),
  value: custom,
});

const errorShape = { status: CONSTANTS.VERTX_ERROR_STATUS };

const producerMetadata = {
  topic: 'my_topic',
  tickRate: 2000,
  producerStarted: true,
};

const consumerMetadata = {
  topic: 'my_topic',
  tickRate: 2000,
  consumerStarted: true,
};

const sendMessage =
  (
    sendFn = () => console.error('No message function!') // eslint-disable-line no-console
  ) =>
  (content) =>
    sendFn({ data: JSON.stringify(content) });

export const storybookWebsocket = (
  responseType = CONSTANTS.PRODUCER,
  errorRate = 5,
  openingDelay = 200,
  msgEvery = 500
) => {
  let evtInterval;
  const mockSocket = controlledWebsocket(responseType, () =>
    clearInterval(evtInterval)
  );
  setTimeout(() => {
    mockSocket.triggerOpen();
    evtInterval = setInterval(() => {
      if (mockSocket.isRunning()) {
        Math.floor(Math.random() * 100) > errorRate
          ? mockSocket.sendPayload()
          : mockSocket.sendErrorPayload();
      }
    }, msgEvery);
  }, openingDelay);

  return mockSocket.getSocket();
};

export const controlledWebsocket = (
  socketType = CONSTANTS.PRODUCER,
  onClose = NO_OP,
  onStart = NO_OP
) => {
  let eventListeners = {};
  let running = false;
  let offset = 0;

  return {
    getSocket: () => ({
      addEventListener: (evt, handler) => {
        eventListeners = { ...eventListeners, [evt]: handler };
      },
      close: () => {
        running = false;
        onClose();
      },
      send: (evt) => {
        const parsedEvt = JSON.parse(evt);
        if (parsedEvt.action === 'start') {
          running = true;
          const sendMessageFn = sendMessage(eventListeners.message);
          if (socketType === CONSTANTS.PRODUCER) {
            //send the metadata event
            sendMessageFn(producerMetadata);
          } else if (socketType === CONSTANTS.CONSUMER) {
            //send the metadata event
            sendMessageFn(consumerMetadata);
          }
          onStart(evt);
        } else if (parsedEvt.action === 'stop') {
          running = false;
        }
      },
    }),
    isRunning: () => running,
    triggerOpen: () => eventListeners.open(),
    triggerClose: () => eventListeners.close(),
    sendPayload: (custom) =>
      eventListeners.message &&
      sendMessage(eventListeners.message)(successShape(offset++, custom)),
    sendErrorPayload: () =>
      eventListeners.message && sendMessage(eventListeners.message)(errorShape),
  };
};
