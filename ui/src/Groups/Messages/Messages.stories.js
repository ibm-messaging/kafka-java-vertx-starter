/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { ConsumerMessages, ProducerMessages } from './index.js';
import { ConsumerMessage, ProducerMessage } from 'Elements';
import { testMessages, STATUS_ERROR } from './Messages.assets.js';
import MessagesReadme from './README.md';

const renderHelper = (
  Component,
  ChildComponent,
  messages = testMessages,
  defaultClassName
) => () => {
  const className = text('Custom CSS classname', defaultClassName);
  let props = {
    children: messages.map((msg, index) => (
      <ChildComponent
        key={`m-${index}`}
        error={msg.status === STATUS_ERROR ? { message: 'Error!' } : undefined}
        message={msg.status !== STATUS_ERROR ? msg : undefined}
        isFirst={index === 0}
      />
    )),
    className,
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
    renderHelper(ConsumerMessages, ConsumerMessage)
  )
  .add(
    'ProducerMessage component (default props)',
    renderHelper(ProducerMessages, ProducerMessage)
  )
  .add(
    'ConsumerMessage component with empty messages list',
    renderHelper(ConsumerMessages, ConsumerMessage, [])
  )
  .add(
    'ProducerMessage component with empty messages list',
    renderHelper(ProducerMessages, ProducerMessage, [])
  );
