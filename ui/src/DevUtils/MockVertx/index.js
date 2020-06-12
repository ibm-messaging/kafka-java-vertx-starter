// used to run in dev mode - websocket server hosted on port 7050 as proxied by webpack

const { startMockVertx, defaultConfig } = require('./MockVertxServer.js');

const onEnd = startMockVertx({
  ...defaultConfig,
  // if required, you can change the configuration here
  port: 7050,
});

// gracefully end
process.on('SIGTERM', onEnd);
process.on('SIGINT', onEnd);
