import React from 'react';
// eslint-disable-next-line import/no-unresolved
import { render } from 'test-utils';
import App from './App.js';

describe('App tests', () => {
  it('loads page', () => {
    const { queryByText } = render(<App />);

    const items = queryByText('UI coming soonish!');
    expect(items).toBeTruthy();
  });
});
