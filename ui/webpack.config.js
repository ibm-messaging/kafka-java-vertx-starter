/*
 * (C) Copyright IBM Corp. 2020  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { webpackAliases } = require('./moduleAliases');
const babelPresets = require('./babelPresets.js');
const {
  getDevWebpackProxyConfigForMockVertx,
} = require('./src/DevUtils/MockVertx/MockVertxServer.js');
const VertXConfig = require('./src/DevUtils/MockVertx/config.json');

const parentDir = path.join(__dirname, './');
const PUBLIC_DIR = path.resolve(__dirname, './public/');
const BUILD_DIR = path.resolve(__dirname, '../src/main/resources/webroot');

const MOCK_SERVER_CONFIG = `content='${JSON.stringify(VertXConfig)}'`;
const REAL_SERVER_CONFIG = 'th:content="${config}"';

const htmlPlugin = require('html-webpack-plugin');

module.exports = (_, argv) => {
  const mode = argv.mode || 'development';
  const devMode = mode === 'development';

  const htmlPluginConfiguration = {
    filename: 'index.html',
    template: PUBLIC_DIR + '/index.html',
    title: 'Kafka Java Vertx Starter UI',
    config: devMode ? MOCK_SERVER_CONFIG : REAL_SERVER_CONFIG,
    favicon: PUBLIC_DIR + '/favicon.ico',
  };

  const cssPluginConfiguration = {
    filename: '[name].bundle.css',
    hmr: mode,
  };

  const pluginSet = [
    new htmlPlugin(htmlPluginConfiguration),
    new miniCssExtractPlugin(cssPluginConfiguration),
  ];

  return {
    mode,
    entry: [
      path.join(parentDir, 'src/Bootstrap/index.js'),
      path.join(parentDir, 'src/Bootstrap/index.scss'),
    ],
    module: {
      rules: [
        {
          test: /(\.css|.scss)$/,
          use: [
            devMode
              ? 'style-loader'
              : {
                  loader: miniCssExtractPlugin.loader,
                },
            {
              loader: 'css-loader',
            },
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  includePaths: ['node_modules'],
                },
              },
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
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                publicPath: '/fonts/',
                outputPath: '/fonts/',
              },
            },
          ],
        },
        {
          test: /\.(jpg|gif|png|svg)$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'libs',
            chunks: 'all',
          },
          styles: {
            name: 'styles',
            test: /(\.css|.scss)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
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
