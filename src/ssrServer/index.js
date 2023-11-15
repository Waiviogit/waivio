const path = require( 'path' );

// ignore `.scss` imports
require( 'ignore-styles' );

// transpile imports on the fly
require( '@babel/register')( {
  configFile: path.resolve( __dirname, '../../.babelrc' ),
} );

// import express server
require( './server' );
