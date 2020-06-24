import translations from './Consumer.i18n.json';
import { CONSTANTS } from 'Utils';
import {
  storybookWebsocket,
  controlledWebsocket,
} from 'DevUtils/MockWebsocket';

export { translations };

export const consumerMockWebsocket = () =>
  storybookWebsocket(CONSTANTS.CONSUMER);

export const consumerMockWebsocketForTest = () =>
  controlledWebsocket(CONSTANTS.CONSUMER);
