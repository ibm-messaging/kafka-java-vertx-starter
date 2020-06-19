const baseJest = require('./jest.config.base.js');

module.exports = {
  ...baseJest,
  preset: 'jest-playwright-preset',
  testMatch: ['<rootDir>/e2e/**/*.feature'],
  testEnvironment: '<rootDir>/e2e/testEnvironment.js',
  setupFilesAfterEnv: ['<rootDir>/e2e/features/step_definitions'],
};
