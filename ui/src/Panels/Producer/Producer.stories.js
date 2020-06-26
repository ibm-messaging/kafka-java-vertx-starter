/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { Producer } from './index.js';
import ProducerReadme from './README.md';

import { producerMockWebsocket } from './Producer.assets.js';
import { SelectedMessageProvider } from 'Contexts';

const renderHelper = () => () => {
  const count = number('Count', 5);
  return (
    <SelectedMessageProvider>
      <Producer
        maxNumberOfMessages={count}
        topic={'storybook_example_topic'}
        getProducerWebsocket={producerMockWebsocket}
      />
    </SelectedMessageProvider>
  );
};

storiesOf('Panels/Producer', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: ProducerReadme,
    },
  })
  .add('Producer component', renderHelper());
