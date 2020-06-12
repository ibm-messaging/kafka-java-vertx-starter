const ConfigContext = require('./ConfigContext/ConfigContext.context.js');

module.exports = {
  ConfigContext: ConfigContext.default,
  ConfigContextProvider: ConfigContext.default.Provider,
  ConfigContextConsumer: ConfigContext.default.Consumer,
};
