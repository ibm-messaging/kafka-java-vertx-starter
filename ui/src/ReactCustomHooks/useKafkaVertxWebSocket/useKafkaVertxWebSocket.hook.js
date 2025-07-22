/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useWebSocket, STATUS, useToggle } from 'ReactCustomHooks';
import { CONSTANTS } from 'Utils';
import { throttle } from 'lodash-es';

const onMessage =
  (messageBuffer, updateMetadata, triggerBufferFlush) =>
  ({ data = '{"empty": true}' }) => {
    try {
      const content = JSON.parse(data);
      if (!content.empty) {
        // check if we have a metadata response
        if (
          content.tickRate &&
          (content.consumerStarted || content.producerStarted)
        ) {
          updateMetadata(content);
        } else {
          // must be a message response. As messages can happen very quickly, we throttle state updates, and store new messages in a buffer
          // we are modifying refs here - hence the .current
          messageBuffer.current.push(content);
          triggerBufferFlush();
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `Error occured while parsing onMessageResponse. Error was:`
      );
      // eslint-disable-next-line no-console
      console.dir(err);
    }
  };

const useManagedMessageState = (maxMessageNumber) => {
  const [messageState, updateMessageState] = useState({
    totalMessages: 0,
    totalSuccessMessages: 0,
    totalErrorMessages: 0,
    messages: [],
  });
  const messageStateRef = useRef(messageState);

  const updateMessageStateWithBuffer = (buffer) => {
    const {
      totalMessages,
      totalSuccessMessages,
      totalErrorMessages,
      messages,
    } = messageStateRef.current;
    // add a unique id based on the number of prior messages received, plus a status. Status will be replaced with one from newMessage, if provided
    const processedMessages = buffer.map((newMessage, index) => ({
      status: CONSTANTS.VERTX_SUCCESS_STATUS,
      index: totalMessages + index + 1,
      ...newMessage,
    }));

    // now we have processed the new messages, determine the number of errors/totals
    const newTotalMessages = totalMessages + processedMessages.length;
    const newErrors = processedMessages.filter(
      (processedMessage) =>
        processedMessage.status === CONSTANTS.VERTX_ERROR_STATUS
    ).length;
    const newTotalOfSuccessMessages =
      totalSuccessMessages + processedMessages.length - newErrors;
    const newTotalOfErrorMessages = totalErrorMessages + newErrors;
    let newMessageSet = [].concat(messages).concat(processedMessages);
    // lastly, trim any messages over the limit - losing the oldest
    newMessageSet =
      newMessageSet.length > maxMessageNumber
        ? newMessageSet.slice(
            newMessageSet.length - maxMessageNumber,
            newMessageSet.length
          )
        : newMessageSet;

    messageStateRef.current = {
      totalMessages: newTotalMessages,
      totalSuccessMessages: newTotalOfSuccessMessages,
      totalErrorMessages: newTotalOfErrorMessages,
      messages: newMessageSet,
    };
    updateMessageState({ ...messageStateRef.current });
  };

  return [messageState, updateMessageStateWithBuffer];
};

const useKafkaVertxWebSocket = (
  getWebsocket,
  maxMessageNumber = 300,
  bufferDebouceTimeout = 1000,
  defaultStartContent = {}
) => {
  const [messageState, updateMessageStateWithBuffer] =
    useManagedMessageState(maxMessageNumber);
  const [hasStarted, toggleHasStarted] = useToggle(false);
  const messageBuffer = useRef([]);
  const [metadata, setMetadata] = useState({});
  // disabling lint rule here - throttle returns function, linted cannot detect that
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerBufferFlush = useCallback(
    throttle(() => {
      updateMessageStateWithBuffer(messageBuffer.current.slice(0)); // call the provided callback to process a copy of the buffer
      messageBuffer.current = []; // clear the buffer
    }, bufferDebouceTimeout),
    []
  );

  useEffect(
    () => triggerBufferFlush.cancel, // clear the triggerBufferFlush function on unmount
    [triggerBufferFlush.cancel]
  );

  const { send, currentState } = useWebSocket(getWebsocket, {
    onMessage: onMessage(messageBuffer, setMetadata, triggerBufferFlush),
    onClose: () => toggleHasStarted(),
  });

  const stringifyAndSend = (content) => send(JSON.stringify(content));
  const isReady = currentState === STATUS.OPEN;

  const start = (additionalStartContent = {}) => {
    if (isReady) {
      stringifyAndSend({
        ...defaultStartContent,
        ...additionalStartContent,
        action: 'start',
      });
      toggleHasStarted();
    }
  };

  const stop = () => {
    if (isReady) {
      stringifyAndSend({ action: 'stop' });
      toggleHasStarted();
    }
  };

  return {
    start: start,
    stop: stop,
    isReady,
    isRunning: isReady && hasStarted,
    metadata,
    messages: [].concat(messageState.messages).reverse(),
    totalSuccessMessages: messageState.totalSuccessMessages,
    totalErrorMessages: messageState.totalErrorMessages,
  };
};

export { useKafkaVertxWebSocket };
