/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react/no-multi-comp */ // disabled as we have a hoc funtion in file
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';

import { HEADING, SUBHEADING, BODY, CODE, LABEL } from './Text.assets.js';

const Text = (props) => {
  const { type, className, children, ...others } = props;

  let typeModifier;

  switch (type) {
    case HEADING:
      typeModifier = 'heading';
      break;
    case SUBHEADING:
      typeModifier = 'subheading';
      break;
    default:
    case BODY:
      typeModifier = 'body';
      break;
    case CODE:
      typeModifier = 'code';
      break;
    case LABEL:
      typeModifier = 'label';
      break;
  }

  const classesToApply = cx('Text', `Text--${typeModifier}`, {
    [className]: className,
  });

  return (
    <span {...others} className={classesToApply}>
      {children}
    </span>
  );
};

const commonProps = {
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** optional - child content, expected to be text */
  children: PropTypes.node,
};

const commonDefaultProps = {
  className: '',
};

Text.propTypes = {
  /** required - the typography style applied to this component */
  type: PropTypes.string.isRequired,
  ...commonProps,
};

Text.defaultProps = {
  type: BODY,
  ...commonDefaultProps,
};

// high order component for other text types
const withTypeStyle = (style, name) => {
  // we want to set the type - so destructure and dont use type here
  // eslint-disable-next-line no-unused-vars
  const component = ({ type, ...others }) => <Text {...others} type={style} />;
  component.displayName = name;
  component.propTypes = { ...commonProps };
  component.defaultProps = { ...commonDefaultProps };
  return component;
};

const Heading = withTypeStyle(HEADING, 'Heading');
const Subheading = withTypeStyle(SUBHEADING, 'Subheading');
const Body = withTypeStyle(BODY, 'Body');
const Code = withTypeStyle(CODE, 'Code');
const Label = withTypeStyle(LABEL, 'Label');

export { Text, Heading, Subheading, Body, Code, Label };
