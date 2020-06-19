import { NO_OP, EMPTY_OBJ } from './index.js';

describe('placeholder function tests', () => {
  it('expect that NO_OP returns the expected placeholder value', () => {
    expect(NO_OP()).toBe(true);
  });

  it('expect that EMPTY_OBJ is an empty object', () => {
    expect(EMPTY_OBJ).toEqual({});
  });
});
