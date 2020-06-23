import React from 'react';
import { render } from 'TestUtils';
import Example from './Example.view.js';

export const stepDefs = (cucumber) => {
  cucumber.defineRule('I have a default Example', (world) => {
    world.rendered = render(<Example />);
  });
};
