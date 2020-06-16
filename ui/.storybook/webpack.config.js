const path = require('path');

const miniCssExtractPlugin = require('mini-css-extract-plugin');
const cssPluginConfiguration = {
  filename: '[name].bundle.css',
};

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    test: /\.scss$/,
    use: [
      {
        loader: miniCssExtractPlugin.loader,
      },
      'css-loader',
      {
        loader: 'sass-loader',
        options: {
          sassOptions: {
            includePaths: ['node_modules'],
          },
        },
      },
    ],
    include: [path.resolve(__dirname, '../')],
  });

  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [require.resolve('@storybook/addon-storysource/loader')],
    enforce: 'pre',
  });

  config.plugins.push(new miniCssExtractPlugin(cssPluginConfiguration));

  config.entry.push(path.join(__dirname, '../src/Bootstrap/index.scss'));

  return config;
};
