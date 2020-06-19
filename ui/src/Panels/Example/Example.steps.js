import React from 'react';
import { render } from 'TestUtils';
import Example from './Example.view.js';

export const bootstrap = (cucumber) => {
  cucumber.defineRule('I have a default Example', (world) => {
    world.component = render(<Example />);
  });

  cucumber.defineRule('it should display {string}', (world, content) => {
    const { getByText } = world.component;

    expect(getByText(content)).toBeInTheDocument();
  });
};
