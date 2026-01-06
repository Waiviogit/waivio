#!/usr/bin/env node

// Graceful-fs patches Node's fs to handle EMFILE errors
const realFs = require('fs');
const gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(realFs);

const { spawn } = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const mode = process.argv[2] || 'production';
if (!['production', 'staging'].includes(mode)) {
  process.env.NODE_ENV = 'production';
} else {
  process.env.NODE_ENV = mode;
}

const rootDir = path.resolve(__dirname, '..');
const buildDir = path.join(rootDir, 'build');

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: rootDir,
      env: { ...process.env, NODE_ENV: mode },
      ...options,
    });

    proc.on('error', reject);
    proc.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed with code ${code}`));
    });
  });
}

async function main() {
  console.log(`Building for ${mode}`);

  // Clean build directory
  console.log('Cleaning build directory...');
  fs.emptyDirSync(buildDir);

  // Build client with Vite
  console.log('\n📦 Building client...');
  await runCommand('npx', ['vite', 'build', '--mode', mode]);
  console.log('✅ Client build completed');

  // Build SSR handler with Vite
  console.log('\n📦 Building SSR handler...');
  await runCommand('npx', ['vite', 'build', '--config', 'vite.ssr.config.js', '--mode', mode]);
  console.log('✅ SSR handler build completed');

  // Generate assets.json from Vite manifest if needed
  const manifestPath = path.join(buildDir, 'public', '.vite', 'manifest.json');
  const assetsPath = path.join(buildDir, 'assets.json');
  
  if (fs.existsSync(manifestPath)) {
    const viteManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const assets = {};

    // Convert Vite manifest to webpack-style assets.json
    for (const [key, value] of Object.entries(viteManifest)) {
      if (value.isEntry) {
        const name = value.name || path.basename(key, '.js');
        assets[name] = assets[name] || {};
        assets[name].js = '/' + value.file;
      }
    }

    // Find CSS - it's usually named style.css in manifest
    for (const [key, value] of Object.entries(viteManifest)) {
      if (key === 'style.css' || (value.file && value.file.endsWith('.css'))) {
        assets.main = assets.main || {};
        assets.main.css = '/' + value.file;
        break;
      }
    }

    // Find vendor chunk
    for (const [key, value] of Object.entries(viteManifest)) {
      if (value.name === 'vendor' || key.includes('vendor')) {
        assets.vendor = assets.vendor || {};
        assets.vendor.js = '/' + value.file;
      }
    }

    fs.writeFileSync(assetsPath, JSON.stringify(assets, null, 2));
    console.log('✅ Assets manifest generated');
  }

  console.log('\n🎉 Build completed successfully!');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
