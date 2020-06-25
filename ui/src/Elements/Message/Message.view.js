/* eslint-disable jsx-a11y/label-has-for */ // false positive
/* eslint-disable react/no-multi-comp */ // disabled as we have a hoc funtion in file
import React from 'react';
import PropTypes from 'prop-types';

import {
  ClickableTile,
  ExpandableTile,
  Tag,
  Tile,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from 'carbon-components-react';
import { CheckmarkFilled16, ErrorFilled16 } from '@carbon/icons-react';
import { isEmpty, isFunction } from 'lodash-es';
import clsx from 'clsx';

import { Label } from 'Elements';
import { useTranslate } from 'ReactCustomHooks';
import { CONSUMER, PRODUCER, translations } from './Message.assets.js';
import { idAttributeGenerator } from 'Utils';

const Message = (props) => {
  const {
    usage,
    className,
    isFirst,
    isSelected,
    message,
    error,
    onInteraction,
    ...others
  } = props;

  const classesToApply = clsx('Message', `Message--${usage}`, {
    [`Message--${usage}-first`]: isFirst,
    [`Message--${usage}-selected`]: isSelected,
    [`Message--${usage}-error`]: error,
    [className]: className,
  });

  const translate = useTranslate(translations);

  let messageJSX;
  if (error) {
    messageJSX = renderErrorTile(error);
  } else if (usage === CONSUMER) {
    messageJSX = renderConsumerMessageTile(
      translate,
      message,
      isFirst,
      onInteraction,
      isSelected
    );
  } else {
    messageJSX = renderProducerMessageTile(
      translate,
      message,
      onInteraction,
      isSelected
    );
  }

  let firstTagJSX;
  if (isFirst) {
    firstTagJSX = (
      <div className={`Message__first-container`}>
        <Tag className={`Message__tag-${usage}-first`}>
          {translate('NEWEST')}
        </Tag>
      </div>
    );
  }

  return (
    <div {...others} className={classesToApply}>
      {firstTagJSX}
      {messageJSX}
    </div>
  );
};

const renderConsumerMessageTile = (
  translate,
  message,
  isFirst,
  onInteraction,
  isSelected
) => {
  const { partition, offset, timestamp, value } = message;

  const valueSize = isEmpty(value) ? '0' : value.length.toString();
  return (
    <ExpandableTile
      expanded={isFirst}
      {...getInteractionHandler(onInteraction, CONSUMER, message)}
      className={clsx('Message__tile--consumer', {
        [`Message__tile--consumer--selected`]: isSelected,
      })}
      {...idAttributeGenerator('consumed_message_tile')}
    >
      <TileAboveTheFoldContent>
        <div className={'Message__consumer-details'}>
          <div className={'Message__consumer-partition-offset-container'}>
            {renderValueWithLabel(translate('PARTITION'), partition)}
            {renderValueWithLabel(
              translate('OFFSET'),
              offset,
              'Message__consumer-partition-offset'
            )}
          </div>
          <div>
            <div>
              <Label className={'Message__label'}>
                {translate('CONSUMED_AT', {
                  timestamp: new Date(timestamp).toLocaleString(),
                })}
              </Label>
            </div>
            <div>
              <Label className={'Message__label'}>
                {translate('SIZE', { bytesCount: valueSize })}{' '}
              </Label>
            </div>
          </div>
        </div>
      </TileAboveTheFoldContent>
      <TileBelowTheFoldContent>
        <div className={'Message__consumer-payload'}>
          {renderValueWithLabel('Payload', value)}
        </div>
      </TileBelowTheFoldContent>
    </ExpandableTile>
  );
};

const renderProducerMessageTile = (
  translate,
  message,
  onInteraction,
  isSelected
) => {
  const { partition, offset } = message;

  return (
    <ClickableTile
      {...getInteractionHandler(onInteraction, PRODUCER, message)}
      className={clsx(
        'Message',
        'Message__producer',
        'Message__tile--producer',
        {
          [`Message__tile--producer--selected`]: isSelected,
        }
      )}
      {...idAttributeGenerator('produced_message_tile')}
    >
      <CheckmarkFilled16
        className={clsx('Message__icon', 'Message__icon--checkmark')}
      />
      {renderValueWithLabel(translate('PARTITION'), partition)}
      {renderValueWithLabel(translate('OFFSET'), offset)}
    </ClickableTile>
  );
};

const renderErrorTile = (error) => {
  const { message } = error;
  return (
    <Tile className={'Message__tile--error'}>
      <ErrorFilled16
        className={clsx('Message__icon', 'Message__icon--error')}
      />
      <div>
        <Label className={'Message__error-message'}>{message}</Label>
      </div>
    </Tile>
  );
};

const renderValueWithLabel = (label, value, additionalClasses) => {
  return (
    <div className={clsx('Message__labelled-value', additionalClasses)}>
      <div>
        <Label className={'Message__label'}>{label}</Label>
      </div>
      <div className={'Message__value'}>{value}</div>
    </div>
  );
};

const getInteractionHandler = (onInteraction, usage, message) => {
  const handlerProps = {};

  if (isFunction(onInteraction)) {
    handlerProps.handleClick = (event) => onInteraction(event, usage, message);
    handlerProps.onMouseEnter = (event) => onInteraction(event, usage, message);
  }
  return handlerProps;
};

const commonProps = {
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** optional - indicate the first message */
  isFirst: PropTypes.bool,
  /** optional - indicate a selected message */
  isSelected: PropTypes.bool,
  /** optional - Kafka message */
  message: PropTypes.shape({
    topic: PropTypes.string.isRequired,
    partition: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    timestamp: PropTypes.number.isRequired,
    value: PropTypes.string.isRequired,
  }),
  /** optional - Error details **/
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  /** optional - interaction handler function */
  onInteraction: PropTypes.func,
};

const commonDefaultProps = {
  className: '',
};

Message.propTypes = {
  /** required - the style applied to this component */
  usage: PropTypes.string.isRequired,
  ...commonProps,
};

Message.defaultProps = {
  usage: CONSUMER,
  ...commonDefaultProps,
};

// high order component for specific Message types
const withMessageUsage = (usageChoice, name) => {
  // we want to set the type - so destructure and dont use type here
  // eslint-disable-next-line no-unused-vars
  const component = ({ usage, ...others }) => (
    <Message {...others} usage={usageChoice} />
  );
  component.displayName = name;
  component.propTypes = { ...commonProps };
  component.defaultProps = { ...commonDefaultProps };
  return component;
};

const ProducerMessage = withMessageUsage(PRODUCER, 'ProducerMessage');
const ConsumerMessage = withMessageUsage(CONSUMER, 'ConsumerMessage');

export { ProducerMessage, ConsumerMessage };
