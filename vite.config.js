import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import paths from "./scripts/paths";

let CALLBACK_HOST_URL = 'www.waivio.com';

switch (process.env.NODE_ENV) {
  case 'development':
    CALLBACK_HOST_URL = 'localhost:3000';
    break;
  case 'staging':
    CALLBACK_HOST_URL = 'waiviodev.com';
    break;
  default:
    break;
}

// https://vitejs.dev/config/
export default defineConfig({
  root: './src/client',
  plugins: [react({
    babel: {

      // presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
      // plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
      // presets: [
      //   ['@babel/preset-env', { targets: { node: 'current' } }],
      //   "@babel/preset-react"
      // ],
      // plugins: [
      //   //"react-hot-loader/babel",
      //   "@babel/plugin-syntax-decorators",
      //   ["@babel/plugin-proposal-decorators", { "legacy": true,}],
      //   "@babel/plugin-proposal-class-properties",
      //   ["import", { "libraryName": "antd", "style": true }]
      // ]
      "presets": [
        "@babel/preset-env",
        "@babel/preset-react"
      ],
      "plugins": [
        "react-hot-loader/babel",
        ["@babel/plugin-proposal-decorators",
          {
            "legacy": true
          }],
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime",
      //  "lodash",
        ["import", { "libraryName": "antd", "style": true }]
      ]
    }
    //"babel": { "presets": [ "react-app" ], "plugins": [ [ "@babel/plugin-proposal-decorators", { "legacy": true } ] ] }
  })],
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true
      },
    },
  },
  optimizeDeps: {

      exclude: ['inferno', 'inferno-component'],

  },
  define: {
  'process.env.NODE_ENV': 'development',
  'process.env.STEEMCONNECT_CLIENT_ID': JSON.stringify(
  process.env.STEEMCONNECT_CLIENT_ID || 'www.waivio.com',
),
  'process.env.STEEMCONNECT_REDIRECT_URL': JSON.stringify(`https://${CALLBACK_HOST_URL}/callback`),
  'process.env.STEEMCONNECT_HOST': JSON.stringify(
  process.env.STEEMCONNECT_HOST || 'https://hivesigner.com',
),
  'process.env.STEEMJS_URL': JSON.stringify(process.env.STEEMJS_URL || 'https://anyx.io'),
  'process.env.SIGNUP_URL': JSON.stringify(
  process.env.SIGNUP_URL || 'https://signup.hive.io/?ref=waivio',
),
  'process.env.MANIFEST_PATH': JSON.stringify(paths.assets),
}

})
