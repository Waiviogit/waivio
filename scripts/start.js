#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const { spawn, execSync } = require('child_process');
const { createServer, build: viteBuild } = require('vite');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

let serverProcess = null;
let isRestarting = false;
let viteServer = null;

function killServer() {
  return new Promise(resolve => {
    if (!serverProcess) {
      resolve();
      return;
    }

    const pid = serverProcess.pid;

    serverProcess.once('exit', () => {
      serverProcess = null;
      setTimeout(resolve, 500);
    });

    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', pid, '/f', '/t'], { stdio: 'ignore' });
    } else {
      serverProcess.kill('SIGTERM');
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

  serverProcess = spawn('node', [
    '--experimental-require-module',
    './src/server/index.mjs'
  ], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' },
    shell: false,
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

async function buildSsrHandler() {
  console.log('📦 Building SSR handler with Vite...');
  try {
    await viteBuild({
      configFile: path.join(rootDir, 'vite.ssr.config.js'),
      mode: 'development',
      logLevel: 'warn',
    });
    console.log('✅ SSR handler built');
  } catch (err) {
    console.error('SSR build error:', err);
    throw err;
  }
}

// Generate dev assets.json for SSR
function generateDevAssets(viteServer) {
  const port = viteServer.config.server.port;
  const origin = `http://localhost:${port}`;
  
  const assets = {
    // Vite client for HMR
    viteClient: `${origin}/@vite/client`,
    // Main entry
    main: {
      js: `${origin}/src/client/index.js`,
    },
  };

  fs.mkdirSync(buildDir, { recursive: true });
  fs.writeFileSync(
    path.join(buildDir, 'assets.json'),
    JSON.stringify(assets, null, 2)
  );
}

async function main() {
  console.log('🚀 Starting development server...\n');

  // Ensure build directory exists
  fs.mkdirSync(buildDir, { recursive: true });

  // Start Vite dev server for client
  console.log('📦 Starting Vite dev server...');
  viteServer = await createServer({
    configFile: path.join(rootDir, 'vite.config.js'),
    mode: 'development',
  });

  await viteServer.listen();
  console.log(`✅ Vite dev server running at http://localhost:${viteServer.config.server.port}`);

  // Generate assets.json pointing to Vite dev server
  generateDevAssets(viteServer);

  // Build SSR handler initially
  await buildSsrHandler();

  // Start the Express server
  await startServer();

  // Watch for SSR handler source changes
  const chokidar = await import('chokidar');
  let rebuildTimeout = null;

  const watcher = chokidar.watch([
    'src/server/handlers/**/*.js',
    'src/store/**/*.js',
    'src/routes/**/*.js',
    'src/common/**/*.js',
    'src/client/components/**/*.js',
    'src/waivioApi/**/*.js',
  ], {
    cwd: rootDir,
    ignoreInitial: true,
  });

  watcher.on('change', (filePath) => {
    console.log(`\n📝 Changed: ${filePath}`);
    
    // Debounce rebuild
    if (rebuildTimeout) clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(async () => {
      try {
        await buildSsrHandler();
        await startServer();
      } catch (err) {
        console.error('Rebuild failed:', err);
      }
    }, 500);
  });

  console.log('\n✨ Development server ready!');
  console.log(`   - App: http://localhost:${process.env.PORT || 3000}`);
  console.log(`   - Vite: http://localhost:${viteServer.config.server.port}`);

  // Handle process termination
  process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    watcher.close();
    await viteServer.close();
    await killServer();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    watcher.close();
    await viteServer.close();
    await killServer();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});
