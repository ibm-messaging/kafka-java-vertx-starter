import React from 'react';
import { render } from 'TestUtils';
import App from './App.js';

describe('App tests', () => {
  it('loads page', () => {
    const { queryByText } = render(<App />);

    const items = queryByText('UI coming soonish!');
    expect(items).toBeTruthy();
  });
});
