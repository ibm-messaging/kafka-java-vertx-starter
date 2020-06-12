const path = require('path');
const { webpackAliases } = require('./moduleAliases');
const babelPresets = require('./babelPresets.js');
const {
  getDevWebpackProxyConfigForMockVertx,
} = require('./src/DevUtils/MockVertx/MockVertxServer.js');

const parentDir = path.join(__dirname, './');
const PUBLIC_DIR = path.resolve(__dirname, './public/');
const BUILD_DIR = path.resolve(__dirname, '../src/main/resources/webroot');

const htmlPlugin = require('html-webpack-plugin');

const htmlPluginConfiguration = {
  filename: 'index.html',
  template: PUBLIC_DIR + '/index.html',
  title: 'Kafka Java VertX Starter UI',
};

const pluginSet = [new htmlPlugin(htmlPluginConfiguration)];

module.exports = (_, argv) => {
  return {
    mode: argv.mode || 'development',
    entry: [path.join(parentDir, 'src/Bootstrap/index.js')],
    module: {
      rules: [
        {
          test: /(\.css|.scss)$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.(jsx|js)?$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: babelPresets,
              },
            },
          ],
        },
      ],
    },
    output: {
      filename: '[name].bundle.js',
      path: BUILD_DIR,
    },
    devServer: {
      contentBase: BUILD_DIR,
      compress: true,
      inline: true,
      hot: true,
      proxy: {
        ...getDevWebpackProxyConfigForMockVertx(7050),
      },
    },
    plugins: pluginSet,
    resolve: {
      alias: webpackAliases,
      extensions: ['.js'],
    },
  };
};
