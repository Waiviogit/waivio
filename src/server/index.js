import http from 'http';
import app from './app';

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, () => console.log('SSR started'));
console.log('START');
console.log('process.env.STEEMCONNECT_CLIENT_ID');
console.log(process.env.STEEMCONNECT_CLIENT_ID);
console.log('process.env.STEEMCONNECT_HOST');
console.log(process.env.STEEMCONNECT_HOST);
console.log('process.env.STEEMCONNECT_REDIRECT_URL');
console.log(process.env.STEEMCONNECT_REDIRECT_URL);
console.log('process.env');
console.log(process.env);
console.log('process.env.NODE_ENV');
console.log(process.env.NODE_ENV);
console.log('process.env.production');
console.log(process.env.production);
console.log('END');
if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./app', () => {
    console.log('🔁  HMR Reloading `./app`...');
    server.removeListener('request', currentApp);
    const newApp = require('./app').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
