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
  moduleNameMapper: jestModuleMapper,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/public/',
  ],
  moduleFileExtensions: ['js', 'ts', 'feature'],
};
