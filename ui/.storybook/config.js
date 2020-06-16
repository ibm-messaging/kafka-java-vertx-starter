import { configure, addDecorator, addParameters } from '@storybook/react';
import { addReadme } from 'storybook-readme';

addParameters({
  options: {
    theme: {
      brandTitle: `ibm-messaging/kafka-java-vertx-starter UI storybook`,
      brandUrl: 'https://github.com/ibm-messaging/kafka-java-vertx-starter',
    },
  },
});

import '../src/Bootstrap/index.scss';

function loadStories() {
  const req = require.context('../src', true, /\.stories\.js$/);
  req.keys().forEach((filename) => req(filename));
}

addDecorator(addReadme);
configure(loadStories, module);
