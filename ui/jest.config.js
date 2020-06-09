module.exports = {
  moduleDirectories: ['node_modules', 'TestUtils', __dirname],
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: true,
  coverageReporters: ['json', 'text', 'json-summary'],
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/src/**/index.js',
    '!**/src/**/*.stories.js',
    '!**/src/**/*.assets.js',
    '!**/src/TestUtils/**',
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
