#!/usr/bin/env node

process.env.NODE_ENV = process.argv[2];
if (!['production', 'staging'].includes(process.env.NODE_ENV)) {
  process.env.NODE_ENV = 'production';
}

const fs = require('fs-extra');
const webpack = require('webpack');
const paths = require('./paths');

const createClientConfig = require('../webpack/client');
const createServerConfig = require('../webpack/server');

function copyPublic() {
  fs.copySync(paths.public, paths.buildPublic, {
    dereference: true,
  });
}

async function main() {
  console.log(`Building for ${process.env.NODE_ENV}`);

  fs.emptyDirSync(paths.build);
  copyPublic();

  const clientCompiler = webpack(createClientConfig('prod'));
  const serverCompiler = webpack(createServerConfig('prod'));

  clientCompiler.run(() => {
    serverCompiler.run(() => {});
  });
}

main();
