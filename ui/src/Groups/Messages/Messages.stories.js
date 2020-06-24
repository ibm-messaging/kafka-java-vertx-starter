import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { action } from '@storybook/addon-actions';
import { ConsumerMessages, ProducerMessages } from './index.js';
import { STATUS_SUCCESS, STATUS_ERROR } from './Messages.assets.js';
import { testMessages } from './Messages.spec.assets.js';
import MessagesReadme from './README.md';

const renderHelper = (
  Component,
  messages = testMessages,
  defaultClassName
) => () => {
  const className = text('Custom CSS classname', defaultClassName);
  let props = {
    messages,
    className,
    onInteraction: action('onInteraction'),
  };

  return <Component {...props} />;
};

storiesOf('Groups/Messages', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: MessagesReadme,
    },
  })
  .add(
    'ConsumerMessage component (default props)',
    renderHelper(ConsumerMessages)
  )
  .add(
    'ProducerMessage component (default props)',
    renderHelper(ProducerMessages)
  )
  .add(
    'ConsumerMessage component with empty messages list',
    renderHelper(ConsumerMessages, [])
  )
  .add(
    'ProducerMessage component with empty messages list',
    renderHelper(ProducerMessages, [])
  );
