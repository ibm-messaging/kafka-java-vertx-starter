/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
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
  coverageReporters: ['lcov', 'json', 'text', 'json-summary'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/src/**/index.js',
    '!**/src/**/*.stories.js',
    '!**/src/**/*.assets.js',
    '!**/src/**/*.steps.js',
    '!**/src/TestUtils/**',
    '!**/src/DevUtils/**',
    '!**/*.json',
  ],
  testMatch: ['<rootDir>/src/**/*.feature', '<rootDir>/src/**/*.spec.js'],
  setupFilesAfterEnv: ['<rootDir>/stucumber.setup.js'],
};
