/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, select, text } from '@storybook/addon-knobs';
import { withInfo } from '@storybook/addon-info';
import {
  Text,
  Heading,
  Subheading,
  Body,
  Code,
  Label,
  HEADING,
  SUBHEADING,
  BODY,
  CODE,
  LABEL,
} from './index.js';
import TextReadme from './README.md';

const renderHelper = (
  Component,
  defaultText = 'Hello World',
  showTypePropAndKnob = false
) => () => {
  let props = {};
  if (showTypePropAndKnob) {
    const typeStyle = select(
      'Type style',
      {
        'Heading text': HEADING,
        'Subheading text': SUBHEADING,
        'Body text': BODY,
        'Code text': CODE,
        'Label text': LABEL,
      },
      BODY
    );
    props = {
      ...props,
      type: typeStyle,
    };
  }

  const textToRender = text('Sample text to display', defaultText);
  const customCssClassname = text('Custom CSS classname', undefined);
  props = {
    ...props,
    className: customCssClassname,
  };
  return <Component {...props}>{textToRender}</Component>;
};

storiesOf('Elements/Text', module)
  .addDecorator(withKnobs)
  .addDecorator(withInfo)
  .addParameters({
    readme: {
      sidebar: TextReadme,
    },
  })
  .add(
    'Text component (default props)',
    renderHelper(Text, 'Text component with no properties provided', true)
  )
  .add(
    'Text component',
    renderHelper(Text, 'Text component with properties', true)
  )
  .add('Heading component', renderHelper(Heading, 'Heading component'))
  .add('Subheading component', renderHelper(Subheading, 'Subheading component'))
  .add('Body component', renderHelper(Body, 'Body component'))
  .add('Code component', renderHelper(Code, 'Code component'))
  .add('Label component', renderHelper(Label, 'Label component'));
