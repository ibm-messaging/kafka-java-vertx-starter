/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { debounce, get } from 'lodash-es';

import { translations } from './Producer.assets.js';
import { CONSTANTS, idAttributeGenerator } from 'Utils';
import { SelectedMessageConsumer } from 'Contexts';
import { Counter, ProducerMessages } from 'Groups';
import { ProducerMessage } from 'Elements';
import {
  useTranslate,
  useToggle,
  useKafkaVertxWebSocket,
} from 'ReactCustomHooks';
import { Button, TextInput } from 'carbon-components-react';

const Producer = (props) => {
  const {
    getProducerWebsocket,
    topic,
    maxNumberOfMessages,
    className,
    ...others
  } = props;
  const classesToApply = cx('Producer', { [className]: className });

  const translate = useTranslate(translations);
  const [producerRunning, toggleProducerRunning] = useToggle(false);
  const { start, stop, isReady, isRunning, messages, totalSuccessMessages } =
    useKafkaVertxWebSocket(getProducerWebsocket, maxNumberOfMessages);
  const [messageValue, setMessageValue] = useState(
    translate('MESSAGE_VALUE_DEFAULT', {}, true)
  );
  const debouncedSetMessageValue = debounce(setMessageValue, 100);

  const onButtonClick = () => {
    if (producerRunning) {
      stop();
    } else {
      start({ custom: messageValue });
    }
    toggleProducerRunning();
  };

  const onMessageValueChange = (event) => {
    const value = get(event, 'target.value', '');
    debouncedSetMessageValue(value);
  };

  return (
    <div {...others} className={classesToApply}>
      <Counter
        {...idAttributeGenerator('producer_stats')}
        title={translate('MESSAGES_PRODUCED', {}, true)}
        subtitle={translate('FROM_TOPIC', { topic }, true)}
        count={totalSuccessMessages}
      />
      <div className={'Producer__control'}>
        <TextInput
          {...idAttributeGenerator('producer_value_input')}
          defaultValue={translate('MESSAGE_VALUE_DEFAULT', {}, true)}
          id={'producer_value_input'}
          labelText={translate('MESSAGE_VALUE_LABEL')}
          hideLabel
          light
          disabled={isRunning}
          onChange={onMessageValueChange}
          placeholder={translate('MESSAGE_VALUE_PLACEHOLDER', {}, true)}
        />
        <Button
          disabled={!isReady}
          onClick={onButtonClick}
          size={'field'}
          {...idAttributeGenerator('producer_button')}
        >
          {isRunning
            ? translate('STOP_PRODUCING')
            : translate('START_PRODUCING')}
        </Button>
      </div>
      <ProducerMessages>
        {messages.map((msg, index) => (
          <SelectedMessageConsumer key={`smc-${index}:${msg.index}`}>
            {({ updateSelectedMessage, isSameAsSelected }) => {
              return (
                <ProducerMessage
                  className={cx('Producer__message', {
                    ['Producer__message--first']: index === 0,
                  })}
                  {...idAttributeGenerator('producer_produced_message')}
                  key={`produced-message-${index}:${msg.index}`}
                  isFirst={index === 0}
                  isSelected={isSameAsSelected(msg)}
                  onInteraction={() => updateSelectedMessage(msg)}
                  error={
                    msg.status === CONSTANTS.VERTX_ERROR_STATUS
                      ? { message: translate('ERROR_PRODUCING', {}, true) }
                      : undefined
                  }
                  message={
                    msg.status !== CONSTANTS.VERTX_ERROR_STATUS
                      ? msg
                      : undefined
                  }
                />
              );
            }}
          </SelectedMessageConsumer>
        ))}
      </ProducerMessages>
    </div>
  );
};

Producer.propTypes = {
  /** required - a function which returns a Websocket object
      which is configured to connect to the backend producer */
  getProducerWebsocket: PropTypes.func.isRequired,
  /** required - the topic this producer is producing to. */
  topic: PropTypes.string.isRequired,
  /** optional - the max number of messages to render. Defaults to 10. */
  maxNumberOfMessages: PropTypes.number,
  /** optional - any additional desired styling. Applied to parent element. */
  className: PropTypes.string,
};

Producer.defaultProps = {
  maxNumberOfMessages: 4,
  topic: 'PROVIDE_ME',
};

export { Producer };
