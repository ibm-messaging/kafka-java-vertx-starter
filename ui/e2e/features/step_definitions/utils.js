/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { idAttributeSelector } from 'Utils';

const getSelector = (id) => `css=${idAttributeSelector(id)}`;

const stepNotImplemented = (step) => {
  // eslint-disable-next-line no-console
  const callback = () => console.error(`${step} - Not implemented yet`);
  return [step, callback];
};

export { stepNotImplemented, getSelector };
