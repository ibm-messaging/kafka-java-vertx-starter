/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { idAttributeSelector, idAttributeGenerator } from './index.js';

describe('idAttribute function tests', () => {
  it('idAttributeGenerator returns the expected output for given input', () => {
    const inputId = 'testSelector';
    expect(idAttributeGenerator(inputId)).toEqual({ 'data-testid': inputId });
  });

  it('idAttributeSelector returns the expected output for given input', () => {
    const inputId = 'testSelector';
    expect(idAttributeSelector(inputId)).toBe(`[data-testid="${inputId}"]`);
  });
});
