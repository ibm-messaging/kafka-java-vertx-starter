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
