/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { Consumer } from './index.js';
import { SelectedMessageProvider } from 'Contexts';
import ConsumerReadme from './README.md';

import { consumerMockWebsocket } from './Consumer.assets.js';

const renderHelper = () => () => {
  const count = number('Count', 30);
  return (
    <SelectedMessageProvider>
      <Consumer
        maxNumberOfMessages={count}
        topic={'storybook_example_topic'}
        getConsumerWebsocket={consumerMockWebsocket}
      />
    </SelectedMessageProvider>
  );
};

storiesOf('Panels/Consumer', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: ConsumerReadme,
    },
  })
  .add('Consumer component', renderHelper());
