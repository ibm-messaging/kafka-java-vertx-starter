const attributeName = 'data-testid';

export const idAttributeGenerator = (id) => ({ [attributeName]: id });
export const idAttributeSelector = (id) => `[${attributeName}="${id}"]`;
