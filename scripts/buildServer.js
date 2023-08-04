#!/usr/bin/env node
process.env.NODE_ENV = process.argv[2];
if (!['production', 'staging'].includes(process.env.NODE_ENV)) {
  process.env.NODE_ENV = 'production';
}

const fs = require('fs').promises;
const path = require('path');
const webpack = require('webpack');
const paths = require('./paths');

const createServerConfig = require('../webpack/server');

async function deleteServerJsFiles(directory) {
  try {
    const files = await fs.readdir(directory);

    for (const file of files) {
      if (path.extname(file) === '.js' && file.endsWith('server.js')) {
        await fs.unlink(path.join(directory, file));
      }
    }
  } catch (error) {
    console.error(`Error reading directory: ${error}`);
  }
}

async function main() {
  console.log(`Building for ${process.env.NODE_ENV}`);

  await deleteServerJsFiles(paths.build);

  const serverCompiler = webpack(createServerConfig('prod'));
  serverCompiler.run(() => {
  });
}

main();
