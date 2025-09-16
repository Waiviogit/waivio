const webpack = require('webpack');
const paths = require('../scripts/paths');
const dotenv = require('dotenv');

dotenv.config({ path: `./env/${process.env.NODE_ENV}.env` });
const SERVER_PORT = process.env.PORT || 3000;

const CONTENT_PORT = SERVER_PORT;

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

const MATCH_JS = /\.js$/i;
const MATCH_CSS_LESS = /\.(css|less)$/i;
const MATCH_FONTS = /\.(eot|ttf|woff|woff2|svg)(\?.+)?$/;

const POSTCSS_LOADER = {
  loader: 'postcss-loader',
  options: {
    postcssOptions: {
      plugins: ['postcss-preset-env'],
    },
  },
};

const DEFINE_PLUGIN = new webpack.DefinePlugin({
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
  'process.env.STEEMJS_URL': JSON.stringify(process.env.STEEMJS_URL || 'https://anyx.io'),
  'process.env.SIGNUP_URL': JSON.stringify(
    process.env.SIGNUP_URL || 'https://signup.hive.io/?ref=waivio',
  ),
  'process.env.MANIFEST_PATH': JSON.stringify(paths.assets),
});

const ALIAS = {
  'react-dom': '@hot-loader/react-dom',
  '@images': `${paths.public}/images`,
};

module.exports = {
  SERVER_PORT,
  CONTENT_PORT,
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  POSTCSS_LOADER,
  DEFINE_PLUGIN,
  ALIAS,
};
