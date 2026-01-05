import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import express from 'express';
import cookieParser from 'cookie-parser';
import Handlebars from 'handlebars';

// ESM equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// For loading CommonJS modules
const require = createRequire(import.meta.url);

// Load pre-built SSR handler (CommonJS bundle)
const ssrModule = require('../../build/ssrHandler.js');
const createSsrHandler = ssrModule.default || ssrModule;

// Load CommonJS steemAPI
const steemAPI = require('./steemAPI.js');

// Import ES modules
import { getRobotsTxtContent } from '../common/helpers/robots-helper.js';
import { webPage, sitemap } from './seo-service/seoServiceApi.js';
import botRateLimit from './middleware/botRateLimit.js';
import urlDecodeMiddleware from './middleware/urlDecodeMiddleware.js';
import hostRedirect from './middleware/hostRedirect.mjs';
import { restartHandler } from '../common/services/errorNotifier.js';

// Paths configuration
const rootDir = path.resolve(__dirname, '../..');
const templatesPath = path.join(rootDir, 'templates');
const buildPath = path.join(rootDir, 'build');
const publicPath = path.join(rootDir, 'public');
const buildPublicPath = path.join(buildPath, 'public');

/**
 * Helper function to preserve query parameters in redirects
 * @param {string} url - The original URL
 * @returns {string} - The query string part of the URL
 */
const preserveQueryParams = url => {
  return url?.includes('?') ? url?.substring(url?.indexOf('?')) : '';
};

// Load template
const indexPath = path.join(templatesPath, 'index.hbs');
const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const template = Handlebars.compile(indexHtml);

// Load assets manifest
const assetsPath = path.join(buildPath, 'assets.json');
const assets = JSON.parse(fs.readFileSync(assetsPath, 'utf-8'));

// Create SSR handler with template and assets
const ssrHandler = createSsrHandler(template, assets);

const CACHE_AGE = 1000 * 60 * 60 * 24 * 7;

const app = express();

const IS_DEV = process.env.NODE_ENV === 'development';

app.use(cookieParser());

// Add URL decode middleware to handle %40 encoding from external sources like ChatGPT
app.use(urlDecodeMiddleware);

if (IS_DEV) {
  app.use(express.static(publicPath, { index: false }));
} else {
  process.on('uncaughtExceptionMonitor', restartHandler);
  app.use(express.static(buildPublicPath, { maxAge: CACHE_AGE, index: false }));
  app.use(botRateLimit);
}

// Host redirect middleware - checks if host is valid, redirects unknown hosts in production
app.use(hostRedirect);

app.get('/callback', (req, res) => {
  const accessToken = req.query.access_token;
  const expiresIn = req.query.expires_in;
  const state = req.query.state;
  const next = state && state[0] === '/' ? state : '/';

  if (accessToken && expiresIn) {
    res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
    res.redirect(next);
  } else {
    res.status(401).send({ error: 'access_token or expires_in Missing' });
  }
});

app.get('/i/@:referral', async (req, res) => {
  try {
    const { referral } = req.params;

    const accounts = await steemAPI.sendAsync('get_accounts', [[referral]]);

    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

// Handle encoded referral links from external sources like ChatGPT
app.get('/i/%40:referral', async (req, res) => {
  try {
    const { referral } = req.params;

    const accounts = await steemAPI.sendAsync('get_accounts', [[referral]]);

    if (accounts[0]) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/i/:parent/@:referral/:permlink', async (req, res) => {
  try {
    const { parent, referral, permlink } = req.params;

    const content = await steemAPI.sendAsync('get_content', [referral, permlink]);

    if (content.author) {
      res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
      res.redirect(`/${parent}/@${referral}/${permlink}`);
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.redirect('/');
  }
});

app.get('/ads.txt', async (req, res) => {
  const fileContent = await webPage.getAddsByHost({
    host: req.headers.host,
  });

  res.set('Content-Type', 'text/plain');
  res.send(fileContent);
});

app.get('/sitemap.xml', async (req, res) => {
  const fileContent = await sitemap.getSitemap({
    host: req.headers.host,
    name: 'sitemap',
  });

  res.set('Content-Type', 'text/xml');
  res.send(fileContent);
});

app.get('/sitemap:pageNumber.xml', async (req, res) => {
  const { pageNumber } = req.params;
  const fileContent = await sitemap.getSitemap({
    host: req.headers.host,
    name: `sitemap${pageNumber}`,
  });

  res.set('Content-Type', 'text/xml');
  res.send(fileContent);
});

app.get('/robots.txt', (req, res) => {
  const fileContent = getRobotsTxtContent(req.headers.host);

  res.set('Content-Type', 'text/plain');
  res.send(fileContent);
});

app.get('/whitepaper', (req, res, next) => {
  const { host } = req.headers;
  if (!['www.waivio.com', 'waivio.com', 'waiviodev.com'].includes(host)) return next();

  const filePath = path.resolve(__dirname, '../../whitepaper.pdf');
  res.setHeader('Content-Type', 'application/pdf');
  return res.sendFile(filePath);
});

app.get('/@:author/:permlink/amp', ssrHandler);
app.get('/object/:authorPermlink/:menu', ssrHandler);
app.get('/:category/@:author/:permlink/amp', (req, res) => {
  const { author, permlink } = req.params;

  // Decode author parameter to handle %40 encoding
  const decodedAuthor = decodeURIComponent(author);

  // Preserve query parameters
  const queryString = preserveQueryParams(req.url);
  const redirectUrl = `/@${decodedAuthor}/${permlink}/amp${queryString}`;

  console.log(`Redirecting category post AMP: ${req.url} -> ${redirectUrl}`);

  res.redirect(301, redirectUrl);
});
app.get('/:category/@:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;

  // Decode author parameter to handle %40 encoding
  const decodedAuthor = decodeURIComponent(author);

  // Preserve query parameters
  const queryString = preserveQueryParams(req.url);
  const redirectUrl = `/@${decodedAuthor}/${permlink}${queryString}`;

  console.log(`Redirecting category post: ${req.url} -> ${redirectUrl}`);

  res.redirect(301, redirectUrl);
});

// Handle encoded post links from external sources like ChatGPT
app.get('/%40:author/:permlink', (req, res) => {
  const { author, permlink } = req.params;

  // Preserve query parameters
  const queryString = preserveQueryParams(req.url);
  const redirectUrl = `/@${author}/${permlink}${queryString}`;

  console.log(`Redirecting encoded URL: ${req.url} -> ${redirectUrl}`);

  res.redirect(301, redirectUrl);
});

app.get('/*', ssrHandler);

export default app;

