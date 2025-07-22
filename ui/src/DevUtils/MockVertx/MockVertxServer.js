/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const ws = require('ws');
const {
  generateMockSuccessShape,
  generateMockConsumerMetadataResponseShape,
  generateMockProducerMetadataResponseShape,
  generateMockErrorResponseShape,
} = require('../../TestUtils/server.testutil.js');
const config = require('./config.json');

// Constants

const MAX_OFFSETS = 5000;
const PORT = 8080;
const PRODUCE_ENDPOINT = config.producerPath;
const CONSUME_ENDPOINT = config.consumerPath;
const TOPIC_NAME = config.topic;
const NUMBER_OF_PARTITIONS = 1;
const PLACEHOLDER_PAYLOAD = 'Hello world';
const TICK_RATE = 2000;
const ERROR_CHANCE = -1; // -1 = no errors, 0 -> 100 % chance of an error occuring

// Private helper functions

// maps an object of event/handler pairs (config) to the websocket server
const handleWebsocketEvents =
  (config = {}) =>
  (ws, { url }) => {
    Object.entries(config).forEach(([event, handler]) => {
      ws.on(event, (...args) =>
        handler({
          calledWith: args,
          url,
          ws,
        })
      );
    });
  };

// generator for a simple logger
const generateLogger = (enabled = false) =>
  enabled
    ? (source = 'UNKNOWN_SOURCE', msg = 'Empty message logged', other) => {
        // eslint-disable-next-line no-console
        console.log(`${new Date()} - ${source} - ${msg}`);
        // eslint-disable-next-line no-console
        other && console.dir(other);
      }
    : () => undefined;

const generateModelForConfig = ({
  produceRate = TICK_RATE,
  topic = TOPIC_NAME,
  numberOfPartitions = NUMBER_OF_PARTITIONS,
  defaultPayload = PLACEHOLDER_PAYLOAD,
  maxOffsets = MAX_OFFSETS,
  enableLog = false,
  errorChance = ERROR_CHANCE,
} = {}) => {
  // create in this scope a set of variables which will simulate the state
  // of the producer/consumer
  let consumerConnected = false;
  let producedRecords = [];
  let lastOffsetForPartition = new Map();
  let mockProducerInterval;
  let mockConsume = () => false;
  const logger = generateLogger(enableLog);

  const mockProduce = (custom = defaultPayload, ws) => {
    const partitionBeingProducedTo = Math.floor(
      Math.random() * numberOfPartitions
    );
    const offset = lastOffsetForPartition.get(partitionBeingProducedTo) || 0;
    const produceSuccess = Math.floor(Math.random() * 100) > errorChance;
    let response = {};

    if (produceSuccess) {
      response = generateMockSuccessShape(
        topic,
        partitionBeingProducedTo,
        offset,
        custom
      );
      logger('Mock Produce event', 'Producing the following record', response);
      producedRecords.push(response);
      lastOffsetForPartition.set(partitionBeingProducedTo, offset + 1);
    } else {
      logger('Mock Produce event', `Simulating produce error response`);
      response = generateMockErrorResponseShape();
      producedRecords.push(response);
    }

    // check if we are over our limit for offsets (simulate retention)
    const offsetLimit = producedRecords.length - maxOffsets;
    if (offsetLimit > 0) {
      logger(
        'Mock Produce event',
        `Max offset limit (${maxOffsets}) exceeded (current size: ${producedRecords.length}, over limit by: ${offsetLimit}). Removing oldest records.`
      );
      producedRecords = producedRecords.slice(
        offsetLimit,
        producedRecords.length
      );
    }
    ws.send(JSON.stringify(response)); // send a response back having 'produced'
    mockConsume();
  };

  const handleProduceMessage = (
    { action, custom },
    ws,
    intervalTimer = produceRate
  ) => {
    // if action start, kick off an interval to add to the to be consumed array
    // if stop, cancel that timer
    if (action === 'start' && !mockProducerInterval) {
      logger(
        'Mock Producer',
        `Starting mock producer logic - creating new offset every ${intervalTimer}ms with custom payload '${custom}'`
      );
      mockProducerInterval = setInterval(
        () => mockProduce(custom, ws),
        intervalTimer
      );
      logger('Mock Producer', `Sending metadata event`);
      ws.send(
        JSON.stringify(
          generateMockProducerMetadataResponseShape(topic, produceRate)
        )
      );
    } else if (action === 'stop') {
      logger('Mock Producer', `Stopping mock producer logic`);
      mockProducerInterval = clearInterval(mockProducerInterval);
    }
  };

  const handleConsumeMessage = ({ action }, ws) => {
    // if stop, cancel that timer
    if (action === 'start') {
      logger('Mock Consumer', `Starting mock consumer logic`);
      consumerConnected = true;
      mockConsume = () => {
        logger('Mock Consumer', `Checking if we need to send records`);
        if (consumerConnected) {
          logger(
            'Mock Consumer',
            `Sending ${producedRecords.length} unsent records`
          );
          producedRecords.forEach((record) => ws.send(JSON.stringify(record)));
          logger('Mock Consumer', `All unconsumed records sent`);
          producedRecords = [];
        } else {
          logger(
            'Mock Consumer',
            `No consumer connected - nothing to send records to`
          );
        }
      };
      logger('Mock Consumer', `Sending metadata event`);
      ws.send(
        JSON.stringify(
          generateMockConsumerMetadataResponseShape(topic, produceRate)
        )
      );
      mockConsume();
    } else if (action === 'stop') {
      logger('Mock Consumer', `Stoping mock consumer logic`);
      consumerConnected = false;
    }
  };

  return {
    handleProduceMessage,
    handleConsumeMessage,
  };
};

// generator for the model logic for the mock server
const generateHandlers = (
  { produceEndpoint, consumeEndpoint, ...modelConfigs },
  otherEventHandlers = {}
) => {
  const { handleProduceMessage, handleConsumeMessage } = generateModelForConfig(
    { ...modelConfigs }
  );
  return handleWebsocketEvents({
    ...otherEventHandlers,
    message: ({ calledWith, url, ws }) => {
      const data = calledWith.length === 1 ? JSON.parse(calledWith[0]) : {};
      switch (url) {
        case produceEndpoint:
          handleProduceMessage(data, ws);
          break;
        case consumeEndpoint:
          handleConsumeMessage(data, ws);
          break;
        default:
          break;
      }
    },
    close: ({ url }) => {
      // Send a stop message to stop the consumer or producer when the socket closes
      const stopMessage = { action: 'stop' };
      switch (url) {
        case produceEndpoint:
          handleProduceMessage(stopMessage);
          break;
        case consumeEndpoint:
          handleConsumeMessage(stopMessage);
          break;
        default:
          break;
      }

      // Call any other close handlers
      if (otherEventHandlers.close) {
        otherEventHandlers.close({ url });
      }
    },
  });
};

// Externals

const defaultConfig = {
  // port the server will listen on
  port: PORT,
  // produce records endpoint
  produceEndpoint: PRODUCE_ENDPOINT,
  // consume records endpoint
  consumeEndpoint: CONSUME_ENDPOINT,
  // enable/disable extra logging
  enableLog: false,
  // one record will be produced every produceRate ms
  produceRate: TICK_RATE,
  // name of the topic being produced/consumed
  topic: TOPIC_NAME,
  // the number of partitions this topic has
  numberOfPartitions: NUMBER_OF_PARTITIONS,
  // the default produced payload, if one is not specifed by the user
  defaultPayload: PLACEHOLDER_PAYLOAD,
  // max number of mock offsets to keep in the server
  maxOffsets: MAX_OFFSETS,
  // percentage change of a produce request failing
  errorChance: ERROR_CHANCE,
};

const getDevWebpackProxyConfigForMockVertx = (
  port = defaultConfig.port,
  produceEndpoint = defaultConfig.produceEndpoint,
  consumeEndpoint = defaultConfig.consumeEndpoint
) => ({
  [produceEndpoint]: {
    target: `ws://localhost:${port}`,
    ws: true,
  },
  [consumeEndpoint]: {
    target: `ws://localhost:${port}`,
    ws: true,
  },
});

const startMockVertx = (config = {}) => {
  const {
    port = PORT,
    produceEndpoint = PRODUCE_ENDPOINT,
    consumeEndpoint = CONSUME_ENDPOINT,
    enableLog = false,
    produceRate = TICK_RATE,
    topic = TOPIC_NAME,
    numberOfPartitions = NUMBER_OF_PARTITIONS,
    defaultPayload = PLACEHOLDER_PAYLOAD,
    maxOffsets = MAX_OFFSETS,
    errorChance = ERROR_CHANCE,
  } = config;
  const mainLogger = generateLogger(true);
  mainLogger('startMockVertx', 'Starting mock vertx server');
  mainLogger('startMockVertx', 'Configuration provided', config);
  mainLogger('startMockVertx', 'Generating handlers and model for this config');
  const onConnectionHandlers = generateHandlers(
    {
      produceEndpoint,
      consumeEndpoint,
      produceRate,
      topic,
      numberOfPartitions,
      defaultPayload,
      maxOffsets,
      enableLog,
      errorChance,
    },
    {
      close: ({ url }) =>
        mainLogger('startMockVertx', `${url} connection closing`),
    }
  );
  // create a single server
  const server = new ws.Server({
    port,
  });
  server.on('listening', () =>
    mainLogger('startMockVertx', 'Mock vertx server waiting for connections')
  );
  server.on('connection', (_, { url }) =>
    mainLogger('startMockVertx', `New connection on ${url}`)
  );
  server.on('connection', onConnectionHandlers);
  server.on('close', () =>
    mainLogger('startMockVertx', 'Closed mock vertx server')
  );
  // return a function to gracefully end the server
  return () => {
    mainLogger('startMockVertx', 'Request to close mock vertx server');
    server.close();
  };
};

module.exports = {
  defaultConfig,
  startMockVertx,
  getDevWebpackProxyConfigForMockVertx,
};
