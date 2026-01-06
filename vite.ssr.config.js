import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
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
      // Only process .js files in src directory
      if (!id.endsWith('.js') || !id.includes('src')) return;
      
      const hasJSX = code.includes('<') && code.match(/<[\w]/);
      const hasDecorators = code.includes('@') && code.match(/@\w+[\s\n]*[\w(class]/);
      
      if (!hasJSX && !hasDecorators) return;

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

export default defineConfig(({ mode }) => {
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

  const port = parseInt(envConfig.PORT || '3000', 10);

  let callbackHostUrl = 'www.waivio.com';
  if (mode === 'development') callbackHostUrl = `localhost:${port}`;
  else if (mode === 'staging') callbackHostUrl = 'waiviodev.com';

  const nodeModules = fs.readdirSync(path.resolve(__dirname, 'node_modules'))
    .filter(name => !name.startsWith('.'));

  return {
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.HIVE_AUTH': JSON.stringify('ea77153b-b08a-4e5e-b2b6-e175b41e3776'),
      'process.env.PAYPAL_CLIENT_ID': JSON.stringify(
        envConfig.PAYPAL_CLIENT_ID || 'Ab1PkIju8eYhVG7dwometncm_FgN0IA7ZP1TvjHuSdoXZWQCocEPazBkaFoqze1YvA4r45Xi0oQ_rdWe'
      ),
      'process.env.STEEMCONNECT_CLIENT_ID': JSON.stringify(envConfig.STEEMCONNECT_CLIENT_ID || 'www.waivio.com'),
      'process.env.STEEMCONNECT_REDIRECT_URL': JSON.stringify(`https://${callbackHostUrl}/callback`),
      'process.env.STEEMCONNECT_HOST': JSON.stringify(envConfig.STEEMCONNECT_HOST || 'https://hivesigner.com'),
      'process.env.STEEMJS_URL': JSON.stringify(envConfig.STEEMJS_URL || 'https://api.deathwing.me'),
      'process.env.SIGNUP_URL': JSON.stringify(envConfig.SIGNUP_URL || 'https://signup.hive.io/?ref=waivio'),
    },

    plugins: [
      // Replace package.json require with actual version
      {
        name: 'replace-package-json',
        transform(code, id) {
          if (id.includes('postHelpers')) {
            return code.replace(
              /require\(['"]\.\.\/\.\.\/\.\.\/package\.json['"]\)\.version/g,
              JSON.stringify(pkg.version)
            );
          }
        }
      },
      // Transform antd Icon/Form imports for compatibility
      antdCompatTransformPlugin(),
      // Transform JSX/decorators before anything else
      jsxTransformPlugin(),
      react({
        include: '**/*.{jsx,tsx}',
        babel: {
          babelrc: false,
          configFile: false,
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-class-properties',
          ],
        },
      }),
      // Replace CSS imports with empty module for SSR
      {
        name: 'css-stub',
        enforce: 'pre',
        resolveId(id, importer) {
          if (id.match(/\.(css|less|scss|sass)(\?.*)?$/)) {
            return '\0css-stub';
          }
        },
        load(id) {
          if (id === '\0css-stub') {
            return 'export default {}';
          }
        },
      },
    ],

    build: {
      outDir: 'build',
      emptyOutDir: false,
      ssr: true,
      sourcemap: false,
      minify: false,
      rollupOptions: {
        input: {
          ssrHandler: path.resolve(__dirname, 'src/server/handlers/createSsrHandler.js'),
        },
        output: {
          format: 'cjs',
          entryFileNames: '[name].js',
          exports: 'auto',
          // Handle ESM default export interop for packages like @react-page/*
          interop: 'compat',
        },
        external: [
          ...nodeModules.filter(name => 
            !name.startsWith('antd') && 
            !name.startsWith('@ant-design') && 
            !name.startsWith('rc-') &&
            !name.startsWith('@rc-component')
          ),
          /^node:/,
        ],
        maxParallelFileOps: 2,
      },
    },

    ssr: {
      // Bundle antd and related packages to avoid ESM resolution issues in Node.js
      noExternal: [
        'antd',
        '@ant-design/compatible',
        '@ant-design/icons',
        '@ant-design/icons-svg',
        '@ant-design/colors',
        '@ant-design/cssinjs',
        /^rc-/,
        /^@rc-component/,
      ],
      // Externalize other node_modules
      external: nodeModules.filter(name => 
        !name.startsWith('antd') && 
        !name.startsWith('@ant-design') && 
        !name.startsWith('rc-') &&
        !name.startsWith('@rc-component')
      ),
    },

    resolve: {
      alias: {
        '@hot-loader/react-dom': 'react-dom',
        'lodash/default': 'lodash',
        // Use CommonJS version of antd for SSR to avoid ESM resolution issues
        'antd/es': 'antd/lib',
        // Use @ant-design/compatible for Form.create support
        'antd/lib/form': '@ant-design/compatible/lib/form',
        'antd/es/form': '@ant-design/compatible/lib/form',
        // Local module aliases for bundling
        '@client': path.resolve(__dirname, 'src/client'),
        // Alias rc-* packages to use lib instead of es for Node.js compatibility
        'rc-util/es': 'rc-util/lib',
        'rc-picker/es': 'rc-picker/lib',
        'rc-table/es': 'rc-table/lib',
        'rc-tree/es': 'rc-tree/lib',
        'rc-tree-select/es': 'rc-tree-select/lib',
        'rc-select/es': 'rc-select/lib',
        'rc-pagination/es': 'rc-pagination/lib',
        'rc-input/es': 'rc-input/lib',
        'rc-input-number/es': 'rc-input-number/lib',
        'rc-field-form/es': 'rc-field-form/lib',
        'rc-cascader/es': 'rc-cascader/lib',
        'rc-checkbox/es': 'rc-checkbox/lib',
        'rc-collapse/es': 'rc-collapse/lib',
        'rc-dialog/es': 'rc-dialog/lib',
        'rc-drawer/es': 'rc-drawer/lib',
        'rc-dropdown/es': 'rc-dropdown/lib',
        'rc-image/es': 'rc-image/lib',
        'rc-menu/es': 'rc-menu/lib',
        'rc-mentions/es': 'rc-mentions/lib',
        'rc-motion/es': 'rc-motion/lib',
        'rc-notification/es': 'rc-notification/lib',
        'rc-progress/es': 'rc-progress/lib',
        'rc-rate/es': 'rc-rate/lib',
        'rc-resize-observer/es': 'rc-resize-observer/lib',
        'rc-segmented/es': 'rc-segmented/lib',
        'rc-slider/es': 'rc-slider/lib',
        'rc-steps/es': 'rc-steps/lib',
        'rc-switch/es': 'rc-switch/lib',
        'rc-tabs/es': 'rc-tabs/lib',
        'rc-textarea/es': 'rc-textarea/lib',
        'rc-tooltip/es': 'rc-tooltip/lib',
        'rc-upload/es': 'rc-upload/lib',
        'rc-virtual-list/es': 'rc-virtual-list/lib',
        '@rc-component/trigger/es': '@rc-component/trigger/lib',
        '@rc-component/tour/es': '@rc-component/tour/lib',
        '@rc-component/color-picker/es': '@rc-component/color-picker/lib',
      },
    },

    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
  };
});
