/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { mountHook, act } from 'TestUtils';
import { useToggle } from '../index.js';

describe('useToggle when', () => {
  it('called with no parameter returns the expected starting state and externals', () => {
    const { getResultFromHook } = mountHook(useToggle);
    const [state, toggleFn] = getResultFromHook();
    expect(state).toBe(false);
    expect(toggleFn).toEqual(expect.any(Function));
  });

  it('invoked, the returned function updates the hook to return the next expected toggled state', () => {
    const { getResultFromHook } = mountHook(useToggle);
    const [state, toggleFn] = getResultFromHook();
    expect(state).toBe(false);
    act(() => {
      toggleFn(); // call the provided toggle function
    });
    expect(getResultFromHook('0')).toBe(true);
    act(() => {
      toggleFn(); // call the provided toggle function again - should switch back
    });
    expect(getResultFromHook('0')).toBe(true);
  });
});
