import React from 'react';
import { render } from '../../TestUtils/index.js';
import { ConfigContextConsumer } from '../index.js';

describe('ConfigContext tests', () => {
  it('Test config is read correctly', () => {
    render(
      <ConfigContextConsumer>
        {(config) => {
          expect(config.topic).toBe('topic');
          expect(config.producerPath).toBe('/testProducerPath');
          expect(config.consumerPath).toBe('/testConsumerPath');
        }}
      </ConfigContextConsumer>
    );
  });
});
