import { CONSTANTS } from 'Utils';
const CONSUMER = CONSTANTS.CONSUMER;
const PRODUCER = CONSTANTS.PRODUCER;
const STATUS_SUCCESS = CONSTANTS.VERTX_SUCCESS_STATUS;
const STATUS_ERROR = CONSTANTS.VERTX_ERROR_STATUS;
import translations from './Messages.i18n.json';
const testMessage = {
  status: STATUS_SUCCESS,
  index: 15,
  topic: 'demo',
  partition: 2,
  offset: 1000,
  timestamp: new Date().getTime(),
  value: 'Test value data',
};
const testMessages = [
  {
    ...testMessage,
  },
  {
    ...testMessage,
    offset: 1001,
    index: 16,
  },
  {
    message: 'Test error',
    status: STATUS_ERROR,
    index: 17,
  },
  {
    ...testMessage,
    offset: 1002,
    index: 18,
  },
];

export {
  testMessage,
  testMessages,
  translations,
  CONSUMER,
  PRODUCER,
  STATUS_SUCCESS,
  STATUS_ERROR,
};
