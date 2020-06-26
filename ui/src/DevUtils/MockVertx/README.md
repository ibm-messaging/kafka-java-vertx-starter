# Mock Vertx server

This is a simple node module which implements a representative implementation
of the real backend of this application when running. Details on the exposed
functions can be found below:

- `defaultConfig` - a sensible set of default values. These values are 
documented in the module
- `getDevWebpackProxyConfigForMockVertx` - helper function which returns the 
required configuration to proxy requests via webpack dev server to this mock
server. Make sure the values provided here align with the script used to start
the server for dev purposes
- `startMockVertx` - function to run the server. Expects configuration (ala the
default config as the only parameter). Configuration values used will be printed
on start up. This returns a function, which is used to gracefully stop the 
server. 