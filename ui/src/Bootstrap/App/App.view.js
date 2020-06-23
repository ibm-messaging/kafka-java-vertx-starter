/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-no-bind */
//Disabled lint while stubbing out the panels
import React, { useState } from 'react';
import { useTranslate } from 'ReactCustomHooks/useTranslate/useTranslate.hook.js';
import { Body, Subheading, Heading } from 'Elements/Text';
import translations from './i18n.json';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';

const Producer = () => {
  const [messages, updateMessages] = useState([]);
  return (
    <>
      <button
        aria-label="Start producing messages"
        onClick={() => updateMessages([...messages, 'payload'])}
      />
      <span>Example Producer</span>
      {messages.map((m, index) => (
        <div key={index} aria-label="Produced message">
          {m}
        </div>
      ))}
    </>
  );
};
const Consumer = () => (
  <div aria-label="Start consuming messages">Example Consumer</div>
);

const App = (props) => {
  const translate = useTranslate(translations);
  const { consumer, producer, className } = props;
  return (
    <div className={clsx('App', className)}>
      <img alt={translate('logo_alt', {}, true)} />
      <div>
        <Subheading>{translate('subheading')}</Subheading>
      </div>
      <div>
        <Heading>{translate('heading')}</Heading>
      </div>
      <div>
        <Body>{translate('body')}</Body>
      </div>
      {producer && <Producer />}
      {consumer && <Consumer />}
    </div>
  );
};

App.propTypes = {
  consumer: PropTypes.bool,
  producer: PropTypes.bool,
  className: PropTypes.string,
};

App.defaultProps = {
  consumer: false,
  producer: false,
};

export { App };
