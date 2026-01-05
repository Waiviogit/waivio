#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const { spawn } = require('child_process');
const webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const paths = require('./paths');

const createClientConfig = require('../webpack/client');
const createSsrHandlerConfig = require('../webpack/ssrHandler');

const { CONTENT_PORT } = require('../webpack/configUtils');

let serverProcess = null;
let isRestarting = false;

function killServer() {
  return new Promise(resolve => {
    if (!serverProcess) {
      resolve();
      return;
    }

    const pid = serverProcess.pid;
    
    serverProcess.once('exit', () => {
      serverProcess = null;
      // Wait a bit for port to be released
      setTimeout(resolve, 500);
    });

    // On Windows, use taskkill to kill the process tree
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', pid, '/f', '/t'], { stdio: 'ignore' });
    } else {
      serverProcess.kill('SIGTERM');
      // Force kill after 2 seconds if still running
      setTimeout(() => {
        if (serverProcess) {
          serverProcess.kill('SIGKILL');
        }
      }, 2000);
    }
  });
}

async function startServer() {
  if (isRestarting) return;
  isRestarting = true;

  if (serverProcess) {
    console.log('🔄 Restarting server...');
    await killServer();
  }

  serverProcess = spawn('node', ['./src/server/index.mjs'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
    shell: false,  // Don't use shell on Windows to get correct PID
  });

  serverProcess.on('error', err => {
    console.error('Server process error:', err);
  });

  serverProcess.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.log(`Server process exited with code ${code}`);
    }
  });

  isRestarting = false;
}

async function main() {
  const clientConfig = createClientConfig('dev');
  const ssrHandlerConfig = createSsrHandlerConfig();

  // Override SSR handler config for development (watch mode, no optimization)
  ssrHandlerConfig.mode = 'development';

  const clientCompiler = webpack(clientConfig);
  const ssrHandlerCompiler = webpack(ssrHandlerConfig);

  let isFirstClientBuild = true;
  let isFirstSsrBuild = true;
  let clientReady = false;
  let ssrReady = false;
  let restartTimeout = null;

  function tryStartServer() {
    if (clientReady && ssrReady) {
      startServer();
    }
  }

  // Debounced restart to avoid rapid restarts
  function scheduleRestart() {
    if (restartTimeout) {
      clearTimeout(restartTimeout);
    }
    restartTimeout = setTimeout(() => {
      startServer();
    }, 500);
  }

  // Client compiler - notify when first build is done
  clientCompiler.hooks.done.tap('StartServer', stats => {
    if (stats.hasErrors()) return;
    
    if (isFirstClientBuild) {
      isFirstClientBuild = false;
      clientReady = true;
      console.log('✅ Client build ready');
      tryStartServer();
    }
  });

  // Watch SSR handler and restart server on changes
  ssrHandlerCompiler.watch({}, (err, stats) => {
    if (err) {
      console.error('SSR handler build error:', err);
      return;
    }

    if (stats.hasErrors()) {
      console.error(
        'SSR handler build errors:',
        stats.toString({
          colors: true,
          chunks: false,
          children: false,
        }),
      );
      return;
    }

    console.log('✅ SSR handler rebuilt');

    if (isFirstSsrBuild) {
      isFirstSsrBuild = false;
      ssrReady = true;
      tryStartServer();
    } else {
      // Debounced restart on subsequent builds
      scheduleRestart();
    }
  });

  const clientDevServer = new DevServer(clientCompiler, {
    port: CONTENT_PORT,
    hot: true,
    compress: true,
    noInfo: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: {
      disableDotRule: true,
    },
  });

  clientDevServer.listen(CONTENT_PORT, () => {
    console.log(`📦 Client dev server started on port ${CONTENT_PORT}`);
  });

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    await killServer();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await killServer();
    process.exit(0);
  });
}

main();
