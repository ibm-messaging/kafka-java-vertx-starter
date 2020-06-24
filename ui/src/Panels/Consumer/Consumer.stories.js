import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { Consumer } from './index.js';
import ConsumerReadme from './README.md';

import { consumerMockWebsocket } from './Consumer.assets.js';

const renderHelper = () => () => {
  const count = number('Count', 30);
  return (
    <Consumer
      maxNumberOfMessages={count}
      topic={'storybook_example_topic'}
      getConsumerWebsocket={consumerMockWebsocket}
    />
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
