/* eslint-disable react/no-multi-comp */ // disabled as we have a hoc funtion in file
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { isEmpty } from 'lodash-es';

import { useTranslate } from 'ReactCustomHooks';
import {
  CONSUMER,
  PRODUCER,
  STATUS_ERROR,
  translations,
} from './Messages.assets.js';
import { Body, ConsumerMessage, ProducerMessage, Subheading } from 'Elements';

const Messages = (props) => {
  const { messages, usage, className, onInteraction, ...others } = props;
  const classesToApply = clsx('Messages', `Messages--${usage}`, {
    [className]: className,
    [`Messages--${usage}-empty`]: isEmpty(messages),
  });
  const translate = useTranslate(translations);

  let messagesJSX;
  if (isEmpty(messages)) {
    messagesJSX = renderEmptyMessagesPlaceholder(translate, usage);
  } else {
    messagesJSX = messages.map((message, index) =>
      renderMessage(message, index, usage, onInteraction)
    );
  }

  return (
    <div {...others} className={classesToApply}>
      {messagesJSX}
    </div>
  );
};

const renderMessage = (message, index, usage, onInteraction) => {
  const props = {
    className: clsx('Messages__Message', `Messages__Message--${usage}`, {
      [`Messages__Message--${usage}-first`]: index === 0,
    }),
    isFirst: index === 0,
    key: `${usage}-${index}`,
    onInteraction,
  };

  if (message.status === STATUS_ERROR) {
    props.error = message;
  } else {
    props.message = message;
  }

  return usage === CONSUMER ? (
    <ConsumerMessage {...props} />
  ) : (
    <ProducerMessage {...props} />
  );
};

const renderEmptyMessagesPlaceholder = (translate, usage) => {
  let titleTranslationKey = 'NO_MESSAGES_TITLE_CONSUMER';
  let bodyTranslationKey = 'NO_MESSAGES_BODY_CONSUMER';
  if (usage === PRODUCER) {
    titleTranslationKey = 'NO_MESSAGES_TITLE_PRODUCER';
    bodyTranslationKey = 'NO_MESSAGES_BODY_PRODUCER';
  }

  return (
    <div className={clsx('Messages__empty', `Messages__empty--${usage}`)}>
      <div className={'Messages__empty-title'}>
        <Subheading>{translate(titleTranslationKey)}</Subheading>
      </div>
      <div className={'Messages__empty-body'}>
        <Body>{translate(bodyTranslationKey)}</Body>
      </div>
    </div>
  );
};

const commonProps = {
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** required - array of messages - either Kafka messages or error messages */
  messages: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        topic: PropTypes.string.isRequired,
        partition: PropTypes.number.isRequired,
        offset: PropTypes.number.isRequired,
        timestamp: PropTypes.number.isRequired,
        value: PropTypes.string.isRequired,
      }),
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        message: PropTypes.string,
      }),
    ])
  ).isRequired,
  /** optional - interaction handler function passed to the ConsumerMessage/ProducerMessage elements */
  onInteraction: PropTypes.func,
};

const commonDefaultProps = {
  className: '',
  messages: [],
};

Messages.propTypes = {
  /** required - the style applied to this component */
  usage: PropTypes.string.isRequired,
  ...commonProps,
};

Messages.defaultProps = {
  usage: CONSUMER,
  ...commonDefaultProps,
};

// high order component for specific Message types
const withMessageUsage = (usageChoice, name) => {
  // we want to set the type - so destructure and dont use type here
  // eslint-disable-next-line no-unused-vars
  const component = ({ usage, ...others }) => (
    <Messages {...others} usage={usageChoice} />
  );
  component.displayName = name;
  component.propTypes = { ...commonProps };
  component.defaultProps = { ...commonDefaultProps };
  return component;
};

const ProducerMessages = withMessageUsage(PRODUCER, 'ProducerMessages');
const ConsumerMessages = withMessageUsage(CONSUMER, 'ConsumerMessages');

export { ConsumerMessages, ProducerMessages };
