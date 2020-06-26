/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
// used in both node and browser settings
const { CONSTANTS } = require('../Utils/constants.utils.js');

// functions that return the shapes returned by the backend server. Note that
// the success state is shared between producer and consumer
const generateMockSuccessShape = (
  topic = 'test',
  partition = 0,
  offset = 0,
  payloadValue = 'hello world'
) => ({
  topic,
  partition,
  offset,
  timestamp: Date.now(),
  value: payloadValue,
});

const generateMockMetadataResponseShape = (
  topic = 'test',
  tickRate = 2000,
  isProducer = false
) => ({
  topic,
  tickRate,
  [isProducer ? 'producerStarted' : 'consumerStarted']: true,
});

const generateMockConsumerMetadataResponseShape = (
  topic = 'test',
  tickRate = 2000
) => generateMockMetadataResponseShape(topic, tickRate, false);

const generateMockProducerMetadataResponseShape = (
  topic = 'test',
  tickRate = 2000
) => generateMockMetadataResponseShape(topic, tickRate, true);

const generateMockErrorResponseShape = () => ({
  status: CONSTANTS.VERTX_ERROR_STATUS,
});

// exported via module so can be used in both UI and node use cases
module.exports = {
  generateMockSuccessShape,
  generateMockMetadataResponseShape,
  generateMockConsumerMetadataResponseShape,
  generateMockProducerMetadataResponseShape,
  generateMockErrorResponseShape,
};
