/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
/* eslint-disable react/no-multi-comp */ // disabled as we have a hoc funtion in file
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'clsx';
import { idAttributeGenerator } from 'Utils';

import { useTranslate } from 'ReactCustomHooks';
import { CONSUMER, PRODUCER, translations } from './Messages.assets.js';
import { Body, Subheading } from 'Elements';

const Messages = (props) => {
  const { usage, className, children, ...others } = props;
  // check if we have any child elements. If not, empty state
  const hasChildren = React.Children.count(children) > 0;
  const classesToApply = cx('Messages', `Messages--${usage}`, {
    [className]: className,
    [`Messages--${usage}-empty`]: !hasChildren,
  });
  const translate = useTranslate(translations);

  let titleTranslationKey = 'NO_MESSAGES_TITLE_CONSUMER';
  let bodyTranslationKey = 'NO_MESSAGES_BODY_CONSUMER';
  if (usage === PRODUCER) {
    titleTranslationKey = 'NO_MESSAGES_TITLE_PRODUCER';
    bodyTranslationKey = 'NO_MESSAGES_BODY_PRODUCER';
  }

  return (
    <div {...others} className={classesToApply}>
      {hasChildren ? (
        children
      ) : (
        <div
          {...idAttributeGenerator('messages_empty')}
          className={cx('Messages__empty', `Messages__empty--${usage}`)}
        >
          <div className={'Messages__empty-title-container'}>
            <Subheading className={'Messages__empty-title'}>
              {translate(titleTranslationKey)}
            </Subheading>
          </div>
          <div className={'Messages__empty-body'}>
            <Body>{translate(bodyTranslationKey)}</Body>
          </div>
        </div>
      )}
    </div>
  );
};

const commonProps = {
  /** optional - add any specific styling classes to this component */
  className: PropTypes.string,
  /** optional - child content to render. If this is provided, the expectation is that it will contain either ProducedMessage or ConsumedMessage components. If none provided, empty state will render. */
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
  ]),
};

const commonDefaultProps = {
  className: '',
};

Messages.propTypes = {
  /** required - the style applied to this component */
  usage: PropTypes.string.isRequired,
  ...commonProps,
};

Messages.defaultProps = {
  usage: CONSUMER,
  ...commonDefaultProps,
};

// high order component for specific Message types
const withMessageUsage = (usageChoice, name) => {
  // we want to set the type - so destructure and dont use type here
  // eslint-disable-next-line no-unused-vars
  const component = ({ usage, ...others }) => (
    <Messages {...others} usage={usageChoice} />
  );
  component.displayName = name;
  component.propTypes = { ...commonProps };
  component.defaultProps = { ...commonDefaultProps };
  return component;
};

const ProducerMessages = withMessageUsage(PRODUCER, 'ProducerMessages');
const ConsumerMessages = withMessageUsage(CONSUMER, 'ConsumerMessages');

export { ConsumerMessages, ProducerMessages };
