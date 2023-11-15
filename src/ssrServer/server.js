const paths = require('../../scripts/paths');
const express = require('express');
const cookieParser = require("cookie-parser");
const createSsrHandler = require("./handlers/createSsrHandler");
const Handlebars =require('handlebars');
const fs = require('fs');
//const steemAPI = require("../server/steemAPI");


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

// app.get('/callback', (req, res) => {
//   const accessToken = req.query.access_token;
//   const expiresIn = req.query.expires_in;
//   const state = req.query.state;
//   const next = state && state[0] === '/' ? state : '/';
//
//   if (accessToken && expiresIn) {
//     res.cookie('access_token', accessToken, { maxAge: expiresIn * 1000 });
//     res.redirect(next);
//   } else {
//     res.status(401).send({ error: 'access_token or expires_in Missing' });
//   }
// });
//
// app.get('/i/@:referral', async (req, res) => {
//   try {
//     const { referral } = req.params;
//
//     const accounts = await steemAPI.sendAsync('get_accounts', [[referral]]);
//
//     if (accounts[0]) {
//       res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
//       res.redirect('/');
//     }
//   } catch (err) {
//     res.redirect('/');
//   }
// });
//
// app.get('/i/:parent/@:referral/:permlink', async (req, res) => {
//   try {
//     const { parent, referral, permlink } = req.params;
//
//     const content = await steemAPI.sendAsync('get_content', [referral, permlink]);
//
//     if (content.author) {
//       res.cookie('referral', referral, { maxAge: 86400 * 30 * 1000 });
//       res.redirect(`/${parent}/@${referral}/${permlink}`);
//     } else {
//       res.redirect('/');
//     }
//   } catch (err) {
//     res.redirect('/');
//   }
// });
//
// app.get('/@:author/:permlink/amp', ssrHandler);
// app.get('/object/:authorPermlink/:menu', ssrHandler);
// app.get('/:category/@:author/:permlink/amp', (req, res) => {
//   const { author, permlink } = req.params;
//
//   res.redirect(301, `/@${author}/${permlink}/amp`);
// });
// app.get('/:category/@:author/:permlink', (req, res) => {
//   const { author, permlink } = req.params;
//
//   res.redirect(301, `/@${author}/${permlink}`);
// });

app.get('/*', ssrHandler);
// app.get('/*', (req, res) => {
//   res.send({hello: 'world'})
// });


app.listen( '9000', () => {
  console.log( 'Express server started at http://localhost:9000' );
} );
