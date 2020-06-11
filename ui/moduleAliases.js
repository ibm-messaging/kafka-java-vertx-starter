const path = require('path');
const fs = require('fs');

const src = path.resolve(__dirname, 'src');

// eslint-disable-next-line no-sync
const moduleNames = fs.readdirSync(src);

const modules = moduleNames.reduce((moduleConfig, name) => {
  const currentModule = {
    path: path.resolve(__dirname, `src/${name}`),
    mapper: {
      regex: `^${name}(.*)$`,
      path: `<rootDir>/src/${name}$1`,
    },
  };
  return { ...moduleConfig, [name]: currentModule };
}, {});

const webpackAliases = Object.entries(modules).reduce(
  (aliases, [key, value]) => {
    const { path } = value;
    return { ...aliases, [key]: path };
  },
  {}
);

const jestModuleMapper = Object.values(modules).reduce(
  (mapping, currentModule) => {
    const {
      mapper: { regex, path },
    } = currentModule;
    return { ...mapping, [regex]: path };
  },
  {}
);

module.exports = { webpackAliases, jestModuleMapper };
