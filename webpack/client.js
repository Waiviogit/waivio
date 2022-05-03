const webpack = require('webpack');
const CSSExtract = require('mini-css-extract-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebpackBar = require('webpackbar');
const paths = require('../scripts/paths');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

const {
  CONTENT_PORT,
  MATCH_JS,
  MATCH_CSS_LESS,
  MATCH_FONTS,
  DEFINE_PLUGIN,
  POSTCSS_LOADER,
  ALIAS,
} = require('./configUtils');
const AssetsPlugin = require('assets-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function createConfig(env = 'dev') {
  const IS_DEV = env === 'dev';
  const IS_PROD = !IS_DEV;
  const appPath = IS_DEV ? paths.build : paths.buildPublic;
  const smp = new SpeedMeasurePlugin();

  const config = smp.wrap({
    mode: IS_DEV ? 'development' : 'production',
    entry: [paths.client],
    devtool: IS_DEV ? 'inline-source-map' : '',
    output: {
      path: appPath,
      filename: IS_DEV ? 'bundle.js' : 'bundle-[name].[chunkhash].js',
      publicPath: IS_DEV ? `http://localhost:${CONTENT_PORT}/` : '/',
    },
    context: process.cwd(),
    plugins: [
      DEFINE_PLUGIN,
      new WebpackBar({
        name: 'client',
        color: '#f56be2',
      }),
      new AssetsPlugin({
        path: paths.build,
        filename: 'assets.json',
      }),
    ],
    module: {
      rules: [
        {
          test: MATCH_JS,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: MATCH_FONTS,
          type: 'asset/resource',
        },
        {
          test: /\.(jpg|png|svg)$/,
          type: 'asset/inline',
        },
        {
          test: MATCH_CSS_LESS,
          use: [
            IS_PROD ? CSSExtract.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            POSTCSS_LOADER,
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
  });

  if (IS_DEV) {
    config.entry = ['webpack-dev-server/client', 'webpack/hot/dev-server', ...config.entry];
    config.plugins = [
      ...config.plugins,
      new NodePolyfillPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ];
    config.optimization = {
      minimize: false,
    };
  }

  config.resolve = {
    alias: {
      ...ALIAS,
    },
  };

  if (IS_PROD) {
    config.plugins = [
      ...config.plugins,
      new webpack.optimize.AggressiveMergingPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new NodePolyfillPlugin(),
      new LodashModuleReplacementPlugin({
        collections: true,
        paths: true,
        shorthands: true,
        flattening: true,
      }),
      new CSSExtract({
        filename: '[name].[contenthash].css',
      }),
      // new SWPrecacheWebpackPlugin({
      //   filepath: paths.sw,
      //   stripPrefix: appPath,
      // }),
    ];
    config.optimization = {
      splitChunks: {
        chunks: 'initial',
        minSize: 30000,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        cacheGroups: {
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
          },
          main: {
            name: 'main',
            minChunks: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
      runtimeChunk: {
        name: 'manifest',
      },
    };
  }

  return config;
};
