import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// Load environment variables
dotenv.config({ path: path.join(rootDir, `env/${process.env.NODE_ENV}.env`) });

// Dynamic import of app after env is loaded
const { default: app } = await import('./app.mjs');
const { setupRedisConnections } = await import('./redis/redisClient.js');

const server = http.createServer(app);

const IS_DEV = process.env.NODE_ENV === 'development';
const LOCAL_NETWORK_IP = '0.0.0.0';

const startServer = async () => {
  if (!IS_DEV) await setupRedisConnections();

  server.listen(process.env.PORT || 3000, LOCAL_NETWORK_IP, () =>
    console.log(`SSR started on http://localhost:${process.env.PORT || 3000}`),
  );
};

startServer();

