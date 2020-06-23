import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { ConsumerMessage, ProducerMessage } from './index.js';
import MessageReadme from './README.md';

const renderHelper = (
  Component,
  defaultErrorMessage,
  defaultIsFirst = false,
  defaultIsSelected = false,
  defaultMessagePartition = 0,
  defaultMessageOffset = 100,
  defaultMessageValue = 'Hello World!',
  defaultMessageTimestamp = new Date().getTime()
) => () => {
  const isFirst = boolean('First message', defaultIsFirst);
  const isSelected = boolean('Selected message', defaultIsSelected);
  const message = {
    topic: 'demo',
  };
  message.partition = number('Message partition', defaultMessagePartition);
  message.offset = number('Message offset', defaultMessageOffset);
  message.value = text('Message value', defaultMessageValue);
  message.timestamp = number('Message timestamp', defaultMessageTimestamp);

  const className = text('Custom CSS classname', undefined);
  const props = {
    isFirst,
    isSelected,
    message,
    className,
    onInteraction: action('handleClick'),
  };

  const errorMessage = text('Error message', defaultErrorMessage);
  if (errorMessage) {
    props.error = {
      message: errorMessage,
    };
  }

  return <Component {...props} />;
};

storiesOf('Elements/Message', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: MessageReadme,
    },
  })
  .add(
    'ConsumerMessage component (default props)',
    renderHelper(ConsumerMessage)
  )
  .add(
    'ProducerMessage component (default props)',
    renderHelper(ProducerMessage)
  )
  .add(
    'ConsumerMessage component with first message',
    renderHelper(ConsumerMessage, undefined, true)
  )
  .add(
    'ProducerMessage component with first message',
    renderHelper(ProducerMessage, undefined, true)
  )
  .add(
    'ConsumerMessage component with error',
    renderHelper(ConsumerMessage, 'An error occurred with a consumed message')
  )
  .add(
    'ProducerMessage component with error',
    renderHelper(ProducerMessage, 'An error occurred with a produced message')
  );
