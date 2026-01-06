import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';
import fs from 'fs';

// Read package.json for version
const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));

// Plugin to transform antd Icon imports to @ant-design/icons
// and Form imports to @ant-design/compatible when Form.create is used
function antdCompatTransformPlugin() {
  return {
    name: 'antd-compat-transform',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('src') || !id.endsWith('.js')) return;
      if (!code.includes('antd')) return;
      
      let transformed = code;
      const usesFormCreate = code.includes('Form.create');
      
      // Match import { Form, Icon, other, stuff } from 'antd'
      const importRegex = /import\s*\{([^}]+)\}\s*from\s*['"]antd['"]/g;
      
      transformed = transformed.replace(importRegex, (match, imports) => {
        const importList = imports.split(',').map(s => s.trim());
        const hasIcon = importList.some(i => /^Icon(\s|$)/.test(i));
        const hasForm = importList.some(i => /^Form(\s|$)/.test(i));
        
        if (!hasIcon && !hasForm) return match;
        if (!hasIcon && hasForm && !usesFormCreate) return match;
        
        let result = [];
        
        // Handle Icon - import from @ant-design/icons
        // Create a legacy Icon shim that converts type prop to the new icon component
        if (hasIcon) {
          result.push("import * as AntIcons from '@ant-design/icons';");
          result.push(`const Icon = (props) => {
  const { type, theme, spin, rotate, twoToneColor, ...rest } = props;
  if (!type) return null;
  const iconType = type.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
  const iconName = iconType.charAt(0).toUpperCase() + iconType.slice(1) + (theme === 'filled' ? 'Filled' : theme === 'twoTone' ? 'TwoTone' : 'Outlined');
  const IconComponent = AntIcons[iconName] || AntIcons[iconType + 'Outlined'] || AntIcons[iconType];
  if (!IconComponent) return null;
  return require('react').createElement(IconComponent, { spin, rotate, twoToneColor, ...rest });
};`);
        }
        
        // Handle Form - import from @ant-design/compatible when Form.create is used
        if (hasForm && usesFormCreate) {
          result.push("import { Form } from '@ant-design/compatible';");
        }
        
        // Get remaining imports (exclude Icon, and exclude Form if using Form.create)
        const otherImports = importList.filter(i => {
          if (/^Icon(\s|$)/.test(i)) return false;
          if (/^Form(\s|$)/.test(i) && usesFormCreate) return false;
          return true;
        });
        
        if (otherImports.length > 0) {
          result.push(`import { ${otherImports.join(', ')} } from 'antd'`);
        }
        
        return result.join('\n');
      });
      
      if (transformed !== code) {
        return { code: transformed, map: null };
      }
    },
  };
}

// Plugin to transform JSX and decorators in .js files BEFORE other plugins
function jsxTransformPlugin() {
  let babel;
  
  return {
    name: 'jsx-decorator-transform',
    enforce: 'pre',
    async transform(code, id) {
      // Process .js files in src directory OR in pigeon-overlay (which has JSX in .js files)
      const isSrcFile = id.endsWith('.js') && id.includes('src');
      const isPigeonOverlay = id.includes('pigeon-overlay') && id.endsWith('.js');
      
      if (!isSrcFile && !isPigeonOverlay) return;
      
      const hasJSX = code.includes('<') && code.match(/<[\w]/);
      const hasDecorators = code.includes('@') && code.match(/@\w+[\s\n]*[\w(class]/);
      
      if (!hasJSX && !hasDecorators) return;

      // Use Babel for files with decorators (esbuild doesn't support them)
      if (!babel) {
        babel = await import('@babel/core');
      }

      const result = await babel.transformAsync(code, {
        filename: id,
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          '@babel/plugin-proposal-class-properties',
        ],
        sourceMaps: true,
      });

      return {
        code: result.code,
        map: result.map,
      };
    },
  };
}

// Custom plugin to generate assets.json manifest
function assetsManifestPlugin() {
  return {
    name: 'assets-manifest',
    writeBundle(options, bundle) {
      const manifest = {};
      
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && chunk.isEntry) {
          const name = chunk.name || 'main';
          manifest[name] = manifest[name] || {};
          manifest[name].js = '/' + fileName;
        }
        if (chunk.type === 'asset' && fileName.endsWith('.css')) {
          const name = 'main';
          manifest[name] = manifest[name] || {};
          manifest[name].css = '/' + fileName;
        }
      }

      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && !chunk.isEntry && fileName.includes('vendor')) {
          manifest.vendor = manifest.vendor || {};
          manifest.vendor.js = '/' + fileName;
        }
      }

      const buildDir = options.dir || path.resolve(__dirname, 'build');
      fs.writeFileSync(
        path.join(buildDir, 'assets.json'),
        JSON.stringify(manifest, null, 2)
      );
    }
  };
}

export default defineConfig(({ command, mode }) => {
  const envFile = `./env/${mode}.env`;
  const envConfig = fs.existsSync(envFile) 
    ? Object.fromEntries(
        fs.readFileSync(envFile, 'utf-8')
          .split('\n')
          .filter(line => line && !line.startsWith('#'))
          .map(line => {
            const [key, ...valueParts] = line.split('=');
            return [key?.trim(), valueParts.join('=')?.trim()];
          })
          .filter(([k, v]) => k && v !== undefined)
      )
    : {};

  const isDev = command === 'serve';
  const port = parseInt(envConfig.PORT || '3000', 10);
  const devServerPort = port + 1;

  let callbackHostUrl = 'www.waivio.com';
  if (mode === 'development') callbackHostUrl = `localhost:${port}`;
  else if (mode === 'staging') callbackHostUrl = 'waiviodev.com';

  return {
    root: '.',
    publicDir: 'public',
    
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.BABEL_ENV': JSON.stringify('react'), // Required for pigeon-overlay to use React instead of Inferno
      'process.env.HIVE_AUTH': JSON.stringify('ea77153b-b08a-4e5e-b2b6-e175b41e3776'),
      'process.env.PAYPAL_CLIENT_ID': JSON.stringify(
        envConfig.PAYPAL_CLIENT_ID || 'Ab1PkIju8eYhVG7dwometncm_FgN0IA7ZP1TvjHuSdoXZWQCocEPazBkaFoqze1YvA4r45Xi0oQ_rdWe'
      ),
      'process.env.STEEMCONNECT_CLIENT_ID': JSON.stringify(envConfig.STEEMCONNECT_CLIENT_ID || 'www.waivio.com'),
      'process.env.STEEMCONNECT_REDIRECT_URL': JSON.stringify(`https://${callbackHostUrl}/callback`),
      'process.env.STEEMCONNECT_HOST': JSON.stringify(envConfig.STEEMCONNECT_HOST || 'https://hivesigner.com'),
      'process.env.STEEMJS_URL': JSON.stringify(envConfig.STEEMJS_URL || 'https://api.deathwing.me'),
      'process.env.SIGNUP_URL': JSON.stringify(envConfig.SIGNUP_URL || 'https://signup.hive.io/?ref=waivio'),
      'process.env.SENTRY_DSN': JSON.stringify(envConfig.SENTRY_DSN || ''),
      'process.env.APP_VERSION': JSON.stringify(pkg.version),
      'process.browser': true,
      global: 'globalThis',
    },

    resolve: {
      alias: {
        '@hot-loader/react-dom': 'react-dom',
        'lodash/default': 'lodash',
        // Handle ~ prefix for node_modules imports in Less
        '~': path.resolve(__dirname, 'node_modules'),
        // Alias for project src/client
        '@': path.resolve(__dirname, 'src/client'),
        // Use @ant-design/compatible for Form.create support
        'antd/lib/form': '@ant-design/compatible/lib/form',
        'antd/es/form': '@ant-design/compatible/lib/form',
      },
    },

    plugins: [
      // Transform Icon imports from antd to compatibility component
      {
        name: 'transform-antd-icon',
        enforce: 'pre',
        transform(code, id) {
          // Only process project files
          if (!id.includes('src/') || !id.endsWith('.js')) return;
          
          // Don't transform the Icon compatibility component itself
          if (id.includes('components/Icon/index.js')) return;
          
          // Check if file imports Icon from antd
          const iconImportRegex = /import\s*\{([^}]*\bIcon\b[^}]*)\}\s*from\s*['"]antd['"]/;
          const match = code.match(iconImportRegex);
          
          if (!match) return;
          
          // Parse the imports
          const imports = match[1].split(',').map(s => s.trim());
          const hasIcon = imports.some(i => i === 'Icon' || i.startsWith('Icon '));
          
          if (!hasIcon) return;
          
          // Remove Icon from the antd import and add separate Icon import
          const otherImports = imports.filter(i => i !== 'Icon' && !i.startsWith('Icon '));
          
          let newCode = code;
          
          if (otherImports.length > 0) {
            // Replace import to remove Icon
            newCode = newCode.replace(
              iconImportRegex,
              `import { ${otherImports.join(', ')} } from 'antd'`
            );
          } else {
            // Remove the entire antd import if Icon was the only import
            newCode = newCode.replace(
              /import\s*\{[^}]*\bIcon\b[^}]*\}\s*from\s*['"]antd['"];?\n?/,
              ''
            );
          }
          
          // Add Icon import using the alias (defined below)
          const iconImport = "import Icon from '@/components/Icon';\n";
          
          // Insert Icon import at the beginning, after 'use strict' if present
          if (newCode.startsWith("'use strict'") || newCode.startsWith('"use strict"')) {
            const endOfUseStrict = newCode.indexOf(';') + 1;
            newCode = newCode.slice(0, endOfUseStrict) + '\n' + iconImport + newCode.slice(endOfUseStrict);
          } else {
            newCode = iconImport + newCode;
          }
          
          return newCode;
        },
      },
      
      // Node.js polyfills for browser (Buffer, process, crypto, etc.)
      nodePolyfills({
        include: ['buffer', 'process', 'util', 'stream', 'crypto'],
        globals: {
          Buffer: true,
          process: true,
        },
        // Ensure crypto is polyfilled in the browser
        overrides: {
          crypto: 'crypto-browserify',
        },
      }),
      // Inject crypto polyfill into HTML before any module loads
      {
        name: 'inject-crypto-polyfill',
        transformIndexHtml(html) {
          // This script runs before any modules load, setting up globalThis.crypto
          const polyfillScript = `<script>
            // Polyfill for libraries that expect global.crypto (like react-easy-chart's object-hash)
            if (typeof globalThis !== 'undefined' && typeof window !== 'undefined') {
              // Create a proxy for globalThis that redirects crypto access to window.crypto
              if (!globalThis.crypto && window.crypto) {
                Object.defineProperty(globalThis, 'crypto', {
                  get: function() { return window.crypto; },
                  configurable: true
                });
              }
            }
          </script>`;
          return html.replace('<head>', '<head>' + polyfillScript);
        },
      },
      // Transform antd Icon/Form imports for compatibility
      antdCompatTransformPlugin(),
      // Transform JSX in .js files before anything else
      jsxTransformPlugin(),
      react({
        include: '**/*.{jsx,tsx}',
        babel: {
          // Don't include lodash plugin - it transforms imports in a way Vite doesn't understand
          // Vite/Rollup handles tree-shaking well
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-class-properties',
          ],
          // Don't use .babelrc - we configure everything here
          babelrc: false,
          configFile: false,
        },
      }),
      // Note: vite-plugin-imp removed due to decorator syntax issues
      // antd tree-shaking handled via manualChunks
      !isDev && assetsManifestPlugin(),
    ].filter(Boolean),

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          modifyVars: {},
        },
      },
    },

    build: {
      outDir: 'build/public',
      emptyOutDir: true,
      manifest: true,
      sourcemap: false,
      // Reduce parallelism to avoid EMFILE on Windows
      cssCodeSplit: false,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/client/index.js'),
        },
        output: {
          entryFileNames: 'bundle-[name].[hash].js',
          chunkFileNames: 'bundle-[name].[hash].js',
          assetFileNames: '[name].[hash][extname]',
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-redux', 'redux', 'lodash'],
          },
        },
        maxParallelFileOps: 2,
      },
    },

    server: {
      port: devServerPort,
      strictPort: true,
      cors: true,
      origin: `http://localhost:${devServerPort}`,
      // Limit concurrency to avoid EMFILE on Windows
      fs: {
        strict: false,
      },
      watch: {
        // Increase interval to reduce file watchers
        interval: 1000,
        usePolling: true,
      },
    },

    optimizeDeps: {
      include: ['react', 'react-dom', 'react-redux', 'redux', 'lodash', 'antd', '@ant-design/icons', 'pigeon-overlay', 'steem'],
      // Exclude react-easy-chart - it uses bundled crypto-browserify that accesses global.crypto
      // We lazy-load it in ChartGenerator.js to avoid blocking the app
      exclude: ['react-easy-chart'],
      esbuildOptions: {
        define: {
          global: 'globalThis',
          'process.env.BABEL_ENV': JSON.stringify('react'),
        },
        loader: {
          '.js': 'jsx',
        },
        // Inject global.crypto shim for object-hash
        inject: [path.resolve(__dirname, 'src/client/globalShim.js')],
        // Ignore optional dependencies that aren't installed
        plugins: [
          {
            name: 'ignore-optional-deps',
            setup(build) {
              // Mark inferno and inferno-component as external (they're optional in pigeon-overlay)
              build.onResolve({ filter: /^inferno(-component)?$/ }, () => ({
                path: 'inferno',
                external: true,
              }));
            },
          },
          {
            name: 'fix-react-easy-chart-crypto',
            setup(build) {
              // Patch react-easy-chart which has its own bundled crypto code
              build.onLoad({ filter: /node_modules\/react-easy-chart\/lib\/index\.js$/ }, async (args) => {
                const fs = await import('fs');
                let contents = fs.readFileSync(args.path, 'utf8');
                // The react-easy-chart bundle has crypto-browserify which references global.crypto
                // Replace all instances of global.crypto with (typeof crypto !== 'undefined' ? crypto : window.crypto)
                // This is a workaround for the fact that globalThis is window in browsers
                contents = contents.replace(/([^a-zA-Z_$])global\.crypto/g, '$1(typeof crypto !== "undefined" ? crypto : (typeof window !== "undefined" ? window.crypto : undefined))');
                return { contents, loader: 'js' };
              });
            },
          },
        ],
      },
    },
  };
});
