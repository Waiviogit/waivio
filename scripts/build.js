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

  // Build client first
  await new Promise((resolve, reject) => {
    clientCompiler.run((err, stats) => {
      if (err) {
        console.error('Client build failed:', err);
        reject(err);
        return;
      }

      if (stats.hasErrors()) {
        console.error(
          'Client build errors:',
          stats.toString({
            colors: true,
            chunks: false,
            children: false,
          }),
        );
        reject(new Error('Client build failed with errors'));
        return;
      }

      console.log('Client build completed successfully');
      resolve();
    });
  });

  // Then build server
  await new Promise((resolve, reject) => {
    serverCompiler.run((err, stats) => {
      if (err) {
        console.error('Server build failed:', err);
        reject(err);
        return;
      }

      if (stats.hasErrors()) {
        console.error(
          'Server build errors:',
          stats.toString({
            colors: true,
            chunks: false,
            children: false,
          }),
        );
        reject(new Error('Server build failed with errors'));
        return;
      }

      console.log('Server build completed successfully');
      resolve();
    });
  });

  console.log('Build completed successfully!');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
