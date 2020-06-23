import { render, fireEvent } from 'TestUtils';
import React from 'react';
import { App } from './App.view.js';

const stepDefs = (cucumber) => {
  cucumber.defineRule('I have an instance of App', (world) => {
    const { props } = world;
    world.rendered = render(<App {...props} />);
  });

  cucumber.defineRule('I click to produce a message', (world) => {
    const { rendered } = world;
    const { getByLabelText } = rendered;
    fireEvent.click(getByLabelText('Start producing messages'));
  });
  cucumber.defineRule('a message is produced', (world) => {
    const { rendered } = world;
    const { getByLabelText } = rendered;
    expect(getByLabelText('Produced message')).toBeInTheDocument();
  });
};

export { stepDefs };
