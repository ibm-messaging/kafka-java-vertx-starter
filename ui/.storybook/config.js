/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
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
// add 5 rem padding around all stories
addDecorator((story) => <div style={{ margin: '5rem' }}>{story()}</div>);
addDecorator(addReadme);
configure(loadStories, module);
