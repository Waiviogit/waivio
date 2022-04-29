const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const StartServerPlugin = require('start-server-nestjs-webpack-plugin');
const paths = require('../scripts/paths');
const { MATCH_JS, MATCH_CSS_LESS, DEFINE_PLUGIN, ALIAS } = require('./configUtils');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

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
            },
          },
        },
        {
          test: /\.(jpg|png|svg)$/,
          type: 'asset/inline',
        },
        {
          test: /\.(jpg|png)$/,
          type: 'asset/resource',
        },
        {
          test: MATCH_CSS_LESS,
          use: [
            'isomorphic-style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'less-loader',
              options: {
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      DEFINE_PLUGIN,
      new webpack.AutomaticPrefetchPlugin(),
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
      new webpack.WatchIgnorePlugin({ paths: [paths.assets] }),
      new StartServerPlugin({
        name: 'server.js',
      }),
      new NodePolyfillPlugin(),
    ];
  }

  config.resolve = {
    alias: {
      ...ALIAS,
    },
  };

  return config;
};
