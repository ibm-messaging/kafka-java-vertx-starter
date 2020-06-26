/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const { jestModuleMapper } = require('./moduleAliases.js');
const es_modules = ['lodash-es'];

module.exports = {
  moduleDirectories: ['node_modules', 'TestUtils', __dirname],
  transformIgnorePatterns: es_modules.map(
    (module) => `<rootDir>/node_modules/(?!${module})`
  ),
  transform: {
    '^.+\\.feature$': 'gherkin-jest',
    '^.+\\.js[x]?$': 'babel-jest',
  },
  moduleNameMapper: {
    // must go first so tests stub out non js files
    '/*\\.(svg|ico)$': '<rootDir>/src/TestUtils/mockfile.testutils.js',
    ...jestModuleMapper,
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/public/',
  ],
  moduleFileExtensions: ['js', 'feature'],
};
