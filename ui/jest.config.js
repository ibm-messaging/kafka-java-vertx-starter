const { jestModuleMapper } = require('./moduleAliases.js');

// If you ever see errors from Jest importing es modules, add the module to this array
// It will be added to the ignore transform list - so the module is not then transpiled
// by babel
const es_modules = ['lodash-es'];

module.exports = {
  moduleDirectories: ['node_modules', 'TestUtils', __dirname],
  transformIgnorePatterns: es_modules.map(
    (module) => `<rootDir>/node_modules/(?!${module})`
  ),
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: jestModuleMapper,
  collectCoverage: true,
  coverageReporters: ['lcov', 'json', 'text', 'json-summary'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/src/**/index.js',
    '!**/src/**/*.stories.js',
    '!**/src/**/*.assets.js',
    '!**/src/TestUtils/**',
    '!**/src/DevUtils/**',
    '!**/*.json',
  ],
  coverageDirectory: './coverage/jest/',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/public/',
  ],
};
