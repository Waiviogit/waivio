const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const paths = require('../scripts/paths');
const { MATCH_JS, MATCH_CSS_LESS } = require('./configUtils');
const dotenv = require('dotenv');

dotenv.config({ path: `./env/${process.env.NODE_ENV}.env` });

let CALLBACK_HOST_URL = 'www.waivio.com';

switch (process.env.NODE_ENV) {
  case 'development':
    CALLBACK_HOST_URL = 'localhost:3000';
    break;
  case 'staging':
    CALLBACK_HOST_URL = 'waiviodev.com';
    break;
  default:
    break;
}

// DefinePlugin for SSR handler - client-side env vars that get baked in
const SSR_DEFINE_PLUGIN = new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.HIVE_AUTH': JSON.stringify('ea77153b-b08a-4e5e-b2b6-e175b41e3776'),
  'process.env.PAYPAL_CLIENT_ID': JSON.stringify(
    process.env.PAYPAL_CLIENT_ID ||
      'Ab1PkIju8eYhVG7dwometncm_FgN0IA7ZP1TvjHuSdoXZWQCocEPazBkaFoqze1YvA4r45Xi0oQ_rdWe',
  ),
  'process.env.STEEMCONNECT_CLIENT_ID': JSON.stringify(
    process.env.STEEMCONNECT_CLIENT_ID || 'www.waivio.com',
  ),
  'process.env.STEEMCONNECT_REDIRECT_URL': JSON.stringify(`https://${CALLBACK_HOST_URL}/callback`),
  'process.env.STEEMCONNECT_HOST': JSON.stringify(
    process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
  ),
  'process.env.STEEMJS_URL': JSON.stringify(process.env.STEEMJS_URL || 'https://api.deathwing.me'),
  'process.env.SIGNUP_URL': JSON.stringify(
    process.env.SIGNUP_URL || 'https://signup.hive.io/?ref=waivio',
  ),
});

module.exports = function createConfig() {
  return {
    mode: 'production',
    target: 'node',
    entry: {
      ssrHandler: path.resolve(paths.app, 'src/server/handlers/createSsrHandler.js'),
    },
    output: {
      path: paths.build,
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      libraryExport: 'default',
    },
    context: process.cwd(),
    externals: fs
      .readdirSync(path.resolve(paths.app, 'node_modules'))
      .filter(module => !module.startsWith('.'))
      .map(module => ({ [module]: `commonjs ${module}` }))
      .reduce((a, b) => Object.assign({}, a, b), {}),
    node: {
      __filename: true,
      __dirname: true,
    },
    resolve: {
      alias: {
        // Use @ant-design/compatible for Form.create support
        'antd/lib/form': '@ant-design/compatible/lib/form',
        'antd/es/form': '@ant-design/compatible/es/form',
      },
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
      SSR_DEFINE_PLUGIN,
      new webpack.NormalModuleReplacementPlugin(MATCH_CSS_LESS, 'identity-obj-proxy'),
      new WebpackBar({
        name: 'ssrHandler',
        color: '#c065f4',
      }),
    ],
    optimization: {
      minimize: false, // Keep readable for debugging
    },
  };
};

