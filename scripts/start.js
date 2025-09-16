#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const DevServer = require('webpack-dev-server');

const createClientConfig = require('../webpack/client');
const createServerConfig = require('../webpack/server');

const { CONTENT_PORT } = require('../webpack/configUtils');
const webpack = require('webpack');

async function main() {
  const clientConfig = createClientConfig('dev');

  const clientCompiler = webpack(clientConfig);
  const serverCompiler = webpack(createServerConfig('dev'));

  clientCompiler.hooks.done.tap('done', () => {
    serverCompiler.watch(null, () => {});
  });

  const clientDevServer = new DevServer(
    {
      port: CONTENT_PORT,
      compress: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      historyApiFallback: {
        disableDotRule: true,
      },
    },
    clientCompiler,
  );

  clientDevServer.start(() => console.log('server started'));
}

main();
