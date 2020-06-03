const path = require('path');

// check/detect if a production build (or not) via the webpack -p flag
const IS_PRODUCTION = process.argv.indexOf('-p') != -1;

const parentDir = path.join(__dirname, './');
const PUBLIC_DIR = path.resolve(__dirname, './public/');
const BUILD_DIR = path.resolve(__dirname, './dist')

const htmlPlugin = require('html-webpack-plugin');

const htmlPluginConfiguration = {
  filename: 'index.html',
  template: PUBLIC_DIR + '/index.html',
  title: 'Kafka Java VertX Starter UI'
};

const pluginSet = [
  new htmlPlugin(htmlPluginConfiguration)
]

module.exports = {
  mode: IS_PRODUCTION ? 'production' : 'development',
	entry: [
		path.join(parentDir, 'src/index.js')
	],
	module: {
		rules: [
      {
        test: /(\.css|.scss)$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.(jsx|js)?$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/preset-react']
            }
          }
        ]
			}
		]
	},
	output: {
    filename: '[name].bundle.js',
    path: BUILD_DIR + '/public/',
	},
	devServer: {
    contentBase: BUILD_DIR + '/public',
    compress: true,
    inline: true,
    hot: true
  },
  optimization: {
    usedExports: true,
  },
  plugins: pluginSet
}
