import { configure } from '@storybook/react';
import '../src/Bootstrap/index.scss';

function loadStories() {
  const req = require.context('../src', true, /\.stories\.js$/);
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
