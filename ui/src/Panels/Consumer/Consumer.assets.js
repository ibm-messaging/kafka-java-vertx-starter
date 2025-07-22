/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import translations from './Consumer.i18n.json';
import { CONSTANTS } from 'Utils';
import {
  storybookWebsocket,
  controlledWebsocket,
} from 'DevUtils/MockWebsocket/index.js';

export { translations };

export const consumerMockWebsocket = () =>
  storybookWebsocket(CONSTANTS.CONSUMER);

export const consumerMockWebsocketForTest = () =>
  controlledWebsocket(CONSTANTS.CONSUMER);
