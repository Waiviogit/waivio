const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const StartServerPlugin = require('start-server-webpack-plugin');
const paths = require('../scripts/paths');
const { MATCH_JS, MATCH_CSS_LESS, DEFINE_PLUGIN } = require('./configUtils');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const Uglifyjs = require('uglifyjs-webpack-plugin');

module.exports = function createConfig(env = 'dev') {
  const IS_DEV = env === 'dev';

  const smp = new SpeedMeasurePlugin();

  const config = smp.wrap({
    mode: IS_DEV ? 'development' : 'production',
    target: 'node',
    entry: [paths.server],
    output: {
      path: paths.build,
      filename: 'server.js',
    },
    context: process.cwd(),
    externals: fs
      .readdirSync(path.resolve(paths.app, 'node_modules'))
      .map(module => ({ [module]: `commonjs ${module}` }))
      .reduce((a, b) => Object.assign({}, a, b), {}),
    node: {
      __filename: true,
      __dirname: true,
    },
    module: {
      rules: [
        {
          test: MATCH_JS,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              plugins: [
                [
                  '@babel/plugin-proposal-decorators',
                  {
                    legacy: true,
                  },
                ],
                '@babel/plugin-proposal-class-properties',
                '@babel/plugin-transform-runtime',
                ['import', { libraryName: 'antd', style: true }],
              ],
              cacheDirectory: true,
            },
          },
        },
        {
          test: /\.(png|jpg|gif)$/,
          loader: 'file-loader',
          options: {},
        },
      ],
    },
    plugins: [
      DEFINE_PLUGIN,
      new webpack.NormalModuleReplacementPlugin(MATCH_CSS_LESS, 'identity-obj-proxy'),
      new WebpackBar({
        name: 'server',
        color: '#c065f4',
      }),
    ],
  });

  if (IS_DEV) {
    config.entry = ['webpack/hot/poll?300', ...config.entry];
    config.plugins = [
      ...config.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin([paths.assets]),
      new HardSourceWebpackPlugin(),
      new StartServerPlugin({
        name: 'server.js',
      }),
      new Uglifyjs({
        cache: true,
        parallel: 4,
      }),
    ];
    config.resolve = {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    };
  }

  return config;
};
