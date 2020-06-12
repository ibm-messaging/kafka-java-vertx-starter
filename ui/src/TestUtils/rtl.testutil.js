/* eslint-disable import/export */
/*
 * This file will override the react testing library to allow a
 * custom global render method to be created that includes
 * required providers such as translation. This file should be
 * imported for testing instead of @testing-libary/react.
 * Jest has been configured so this can be imported as 'test-utils'
 */
import React from 'react';
import { render } from '@testing-library/react';
import { ConfigContextProvider } from '../Contexts/index.js';

const mockConfig = {
  topic: 'topic',
  producerPath: 'producerPath',
  consumerPath: 'consumerPath',
};

// eslint-disable-next-line react/prop-types
const AllTheProviders = ({ children }) => {
  // Wrap children with any contexts/providers we end up having
  return (
    <ConfigContextProvider value={mockConfig}>{children}</ConfigContextProvider>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
