const paths = require('../../scripts/paths');
const express = require('express');
const cookieParser = require("cookie-parser");
const createSsrHandler = require("./handlers/createSsrHandler");
const Handlebars =require('handlebars');
const fs = require('fs');


const app = express();

app.use(cookieParser());

const indexPath = `${paths.templates}/index.hbs`;
const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const template = Handlebars.compile(indexHtml);
const ssrHandler = createSsrHandler(template);


const IS_DEV = process.env.NODE_ENV === 'development';

app.use(cookieParser());

const CACHE_AGE = 1000 * 60 * 60 * 24 * 7;

if (IS_DEV) {
  app.use(express.static(paths.publicRuntime(), { index: false }));
} else {
  app.use(express.static(paths.buildPublicRuntime(), { maxAge: CACHE_AGE, index: false }));
}

app.get('/*', ssrHandler);

app.listen( '3002', () => {
  console.log( 'Express server started at http://localhost:3002' );
} );
