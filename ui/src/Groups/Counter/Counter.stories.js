import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, number } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import { Counter } from './index.js';
import CounterReadme from './README.md';

const renderHelper = (
  Component,
  defaultTitle = 'Test title',
  defaultSubtitle = 'Test Subtitle',
  defaultCount = 123,
  defaultCountLimit,
  defaultClassName
) => () => {
  const title = text('Title text', defaultTitle);
  const subtitle = text('Subtitle text', defaultSubtitle);
  const count = number('Count', defaultCount);
  const countLimit = number('Count limit', defaultCountLimit);
  const className = text('Custom CSS classname', defaultClassName);
  let props = {
    title,
    subtitle,
    count,
    countLimit,
    className,
  };

  return <Component {...props} />;
};

storiesOf('Groups/Counter', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: CounterReadme,
    },
  })
  .add('Counter component (default props)', renderHelper(Counter))
  .add(
    'Counter component',
    renderHelper(
      Counter,
      'Messages produced',
      'to topic: test',
      0,
      9999,
      'my-class'
    )
  );
