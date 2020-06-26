/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { createContext } from 'react';

const ConfigContext = createContext({});
const ConfigContextProvider = ConfigContext.Provider;
const ConfigContextConsumer = ConfigContext.Consumer;

export { ConfigContext, ConfigContextProvider, ConfigContextConsumer };
