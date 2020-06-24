/* eslint-disable react/jsx-no-bind */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { translations } from './Consumer.assets.js';
import { CONSTANTS, idAttributeGenerator } from 'Utils';
import { Counter, ConsumerMessages } from 'Groups';
import { ConsumerMessage } from 'Elements';
import {
  useTranslate,
  useToggle,
  useKafkaVertxWebSocket,
} from 'ReactCustomHooks';
import { Button } from 'carbon-components-react';

const Consumer = (props) => {
  const {
    getConsumerWebsocket,
    topic,
    maxNumberOfMessages,
    className,
    ...others
  } = props;
  const classesToApply = clsx('Consumer', { [className]: className });

  const translate = useTranslate(translations);
  const [consumerRunning, toggleConsumerRunning] = useToggle(false);
  const {
    start,
    stop,
    isReady,
    isRunning,
    messages,
    totalSuccessMessages,
  } = useKafkaVertxWebSocket(getConsumerWebsocket, maxNumberOfMessages);

  const onButtonClick = () => {
    if (consumerRunning) {
      stop();
    } else {
      start();
    }
    toggleConsumerRunning();
  };

  return (
    <div {...others} className={classesToApply}>
      <Counter
        {...idAttributeGenerator('consumer_stats')}
        title={translate('MESSAGES_CONSUMED', {}, true)}
        subtitle={translate('FROM_TOPIC', { topic }, true)}
        count={totalSuccessMessages}
        className={'Consumer__count'}
      />
      <div className={'Consumer__control'}>
        <Button
          disabled={!isReady}
          onClick={onButtonClick}
          {...idAttributeGenerator('consumer_button')}
        >
          {isRunning
            ? translate('STOP_CONSUMING')
            : translate('START_CONSUMING')}
        </Button>
      </div>
      <ConsumerMessages>
        {messages.map((msg, index) => (
          <ConsumerMessage
            {...idAttributeGenerator('consumer_consumed_message')}
            key={`consumed-message-${index}:${msg.index}`}
            isFirst={index === 0}
            error={
              msg.status === CONSTANTS.VERTX_ERROR_STATUS
                ? { message: translate('ERROR_CONSUMING', {}, true) }
                : undefined
            }
            message={
              msg.status !== CONSTANTS.VERTX_ERROR_STATUS ? msg : undefined
            }
          />
        ))}
      </ConsumerMessages>
    </div>
  );
};

Consumer.propTypes = {
  /** required - a function which returns a Websocket object
which is configured to connect to the backend consumer */
  getConsumerWebsocket: PropTypes.func.isRequired,
  /** required - the topic this consumer is consuming from. */
  topic: PropTypes.string.isRequired,
  /** optional - the max number of messages to render. Defaults to 30. */
  maxNumberOfMessages: PropTypes.number,
  /** optional - any additional desired styling. Applied to parent element. */
  className: PropTypes.string,
};

Consumer.defaultProps = {
  maxNumberOfMessages: 30,
  topic: 'PROVIDE_ME',
};

export { Consumer };
