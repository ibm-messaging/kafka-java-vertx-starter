/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { Body, Subheading } from 'Elements';

const Counter = (props) => {
  const { title, subtitle, count, countLimit, className, ...others } = props;
  const classesToApply = clsx('Counter', { [className]: className });

  let countValue = count;
  if (count < 0) {
    countValue = '00';
  } else if (count < 10) {
    countValue = '0' + count;
  } else if (count > countLimit) {
    countValue = countLimit + '+';
  }

  return (
    <div {...others} className={classesToApply}>
      <div className={'Counter Counter__title'}>
        <Subheading>{title}</Subheading>
      </div>
      <div>
        <Body className={'Counter Counter__subtitle'}>{subtitle}</Body>
      </div>
      <div className={'Counter Counter__count'}>{countValue}</div>
    </div>
  );
};

Counter.propTypes = {
  /** required - the Counter title  */
  title: PropTypes.string.isRequired,
  /** required - the Counter subtitle  */
  subtitle: PropTypes.string.isRequired,
  /** required - the Counter value. A non-negative integer */
  count: PropTypes.number.isRequired,
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** optional - the maximum limit of the Counter value that is displayed, defaults to 9999 */
  countLimit: PropTypes.number,
};

Counter.defaultProps = {
  title: 'Default title',
  subtitle: 'Default subtitle',
  className: '',
  countLimit: 9999,
};

export { Counter };
