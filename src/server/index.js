import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import { setupRedisConnections } from './redis/redisClient';
dotenv.config({ path: `./env/${process.env.NODE_ENV}.env` });

const server = http.createServer(app);

let currentApp = app;

const IS_DEV = process.env.NODE_ENV === 'development';
const LOCAL_NETWORK_IP = '0.0.0.0'; // Replace with your local network IP address

const startServer = async () => {
  if (!IS_DEV) await setupRedisConnections();

  server.listen(process.env.PORT || 3000, LOCAL_NETWORK_IP, () =>
    console.log(`SSR started on http://localhost:${process.env.PORT || 3000}`),
  );

  if (module.hot) {
    console.log('✅  Server-side HMR Enabled!');

    module.hot.accept('./app', () => {
      try {
        console.log('🔁  HMR Reloading `./app`...');
        server.removeListener('request', currentApp);
        const newApp = require('./app').default;

        server.on('request', newApp);
        currentApp = newApp;
      } catch (err) {
        console.log('HMR :: ', err);
      }
    });
    module.hot.accept();
    module.hot.dispose(() => {
      server.close();
    });
  }
};

startServer();
