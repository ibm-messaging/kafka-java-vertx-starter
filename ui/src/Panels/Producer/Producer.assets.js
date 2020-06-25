import translations from './Producer.i18n.json';
import { CONSTANTS } from 'Utils';
import {
  storybookWebsocket,
  controlledWebsocket,
} from 'DevUtils/MockWebsocket';

export { translations };

export const producerMockWebsocket = () =>
  storybookWebsocket(CONSTANTS.PRODUCER);

export const producerMockWebsocketForTest = (onStart) =>
  controlledWebsocket(CONSTANTS.PRODUCER, undefined, onStart);
