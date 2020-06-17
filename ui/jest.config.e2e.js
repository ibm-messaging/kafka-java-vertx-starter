const baseJest = require('./jest.config.base.js');

module.exports = {
  ...baseJest,
  preset: 'jest-playwright-preset',
  testMatch: ['<rootDir>/e2e/test/*.e2e.js'],
  testEnvironment: '<rootDir>/e2e/testEnvironment.js',
};
