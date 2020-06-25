import { createContext } from 'react';

const ConfigContext = createContext({});
const ConfigContextProvider = ConfigContext.Provider;
const ConfigContextConsumer = ConfigContext.Consumer;

export { ConfigContext, ConfigContextProvider, ConfigContextConsumer };
