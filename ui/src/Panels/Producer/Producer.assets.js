/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import translations from './Producer.i18n.json';
import { CONSTANTS } from 'Utils';
import {
  storybookWebsocket,
  controlledWebsocket,
} from 'DevUtils/MockWebsocket/index.js';

export { translations };

export const producerMockWebsocket = () =>
  storybookWebsocket(CONSTANTS.PRODUCER);

export const producerMockWebsocketForTest = (onStart) =>
  controlledWebsocket(CONSTANTS.PRODUCER, undefined, onStart);
