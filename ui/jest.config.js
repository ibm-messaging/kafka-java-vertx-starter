const baseJest = require('./jest.config.base.js');

module.exports = {
  ...baseJest,
  collectCoverage: true,
  coverageDirectory: './coverage/jest/',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageReporters: ['json', 'text', 'json-summary'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/src/**/index.js',
    '!**/src/**/*.stories.js',
    '!**/src/**/*.assets.js',
    '!**/src/TestUtils/**',
    '!**/src/DevUtils/**',
    '!**/*.json',
  ],
  testMatch: ['<rootDir>/src/**/*.feature', '<rootDir>/src/**/*.spec.js'],
  setupFilesAfterEnv: ['<rootDir>/src/Panels/integration.setup.js'],
};
