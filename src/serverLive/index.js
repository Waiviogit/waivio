// ignore `.scss` imports

process.env.NODE_ENV = 'development'
require( 'ignore-styles' );


// transpile imports on the fly
require('@babel/register')({
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    "@babel/plugin-transform-runtime",
    "@babel/plugin-transform-async-to-generator",
    "@babel/transform-arrow-functions",
    "@babel/proposal-object-rest-spread",
    "@babel/proposal-class-properties",
    ["import", { "libraryName": "antd", "style": "css" }]
  ]
});

// import express server
require( './server' );
