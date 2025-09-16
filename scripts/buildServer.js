#!/usr/bin/env node

process.env.NODE_ENV = process.argv[2];
if (!['production', 'staging'].includes(process.env.NODE_ENV)) {
  process.env.NODE_ENV = 'production';
}

const webpack = require('webpack');
const createServerConfig = require('../webpack/server');

async function main() {
  console.log(`Building server for ${process.env.NODE_ENV}`);

  const serverCompiler = webpack(createServerConfig('prod'));

  serverCompiler.run((err, stats) => {
    if (err) {
      console.error('Server build failed:', err);
      process.exit(1);
    }

    if (stats.hasErrors()) {
      console.error('Server build errors:', stats.toString({
        colors: true,
        chunks: false,
        children: false,
      }));
      process.exit(1);
    }

    console.log('Server build completed successfully');
  });
}

main();