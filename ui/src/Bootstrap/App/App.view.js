import React from 'react';
import { useTranslate } from 'ReactCustomHooks';
import { Body, Subheading, Heading } from 'Elements';
import { Consumer } from 'Panels';
import { ConfigContextConsumer } from 'Contexts';
import { NO_OP } from 'Utils';
import { Grid, Column, Row } from 'carbon-components-react';
import translations from './i18n.json';
import { PropTypes } from 'prop-types';
import clsx from 'clsx';

import es_logo from 'Images/es_logo.svg';

const App = (props) => {
  const translate = useTranslate(translations);
  const { consumer, producer, websocketFactory, className } = props;

  const commonColumnProps = {
    lg: 6,
  };

  return (
    <div className={clsx('App', className)}>
      <Grid>
        <Row>
          <Column
            {...commonColumnProps}
            className={'App App__column--producer App__summary'}
          >
            <img
              alt={translate('logo_alt', {}, true)}
              src={es_logo}
              className={'App App__summary_icon'}
            />
            <div>
              <Subheading className={'App App__summary_subheading'}>
                {translate('app_name')}
              </Subheading>
            </div>
            <div>
              <Heading className={'App App__summary_heading'}>
                {translate('heading')}
              </Heading>
            </div>
            <div>
              <Body className={'App App__summary_body'}>
                {translate('body')}
              </Body>
            </div>
          </Column>
          <Column
            {...commonColumnProps}
            className={'App App__column--consumer'}
          />
        </Row>
        <ConfigContextConsumer>
          {({ topic, producerPath, consumerPath }) => {
            return (
              <Row>
                {producer && (
                  <Column
                    {...commonColumnProps}
                    className={'App App__column--producer'}
                  >
                    <div>{`Producer here for ${topic} at ${producerPath}`}</div>
                  </Column>
                )}
                {consumer && (
                  <Column
                    {...commonColumnProps}
                    className={'App App__column--consumer'}
                  >
                    <Consumer
                      getConsumerWebsocket={websocketFactory(consumerPath)}
                      topic={topic}
                    />
                  </Column>
                )}
              </Row>
            );
          }}
        </ConfigContextConsumer>
      </Grid>
    </div>
  );
};

App.propTypes = {
  consumer: PropTypes.bool,
  producer: PropTypes.bool,
  className: PropTypes.string,
  websocketFactory: PropTypes.func.isRequired,
};

App.defaultProps = {
  consumer: false,
  producer: false,
  websocketFactory: NO_OP,
};

export { App };
