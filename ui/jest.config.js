module.exports = {
  moduleDirectories: [
    'node_modules',
    'TestUtils',
    __dirname
  ],
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  collectCoverage: true
}