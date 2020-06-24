import { STATUS_SUCCESS, STATUS_ERROR } from './Messages.assets.js';

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

export { testMessage, testMessages };
