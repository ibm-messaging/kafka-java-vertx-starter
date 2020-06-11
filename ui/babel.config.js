const babelPresets = require('./babelPresets.js');

module.exports = (api) => {
  const isTest = api.env('test');
  let config = {};
  if (isTest) {
    config = {
      presets: babelPresets,
    };
  }

  return config;
};
