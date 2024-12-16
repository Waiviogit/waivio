import WebSocket from 'ws';

const HIVE_SOCKET_ERR = {
  ERROR: 'error socket closed',
  DISABLED: 'socket disabled',
  CLOSED: 'connection close',
  TIMEOUT: 'Timeout exceed',
};

const CONNECTION_ENV = {
  STAGING: 'wss://waiviodev.com/notifications-api',
  PRODUCTION: 'wss://www.waivio.com/notifications-api',
};

const CONNECTION_STRING =
  process.env.NODE_ENV === 'production' ? CONNECTION_ENV.PRODUCTION : CONNECTION_ENV.STAGING;

class SocketClient {
  constructor(url) {
    this.url = url;
  }

  async init() {
    return new Promise(resolve => {
      this.ws = new WebSocket(this.url);

      this.ws.on('error', () => {
        console.error('error socket closed');
        this.ws.close();
        resolve({ error: new Error(HIVE_SOCKET_ERR.ERROR) });
      });

      this.ws.on('open', () => {
        setTimeout(() => {
          resolve(this.ws);
        }, 100);
      });
    });
  }

  async sendMessage(message = '') {
    if (this?.ws?.readyState !== 1) {
      await this.init();
    }

    return new Promise(resolve => {
      if (this.ws.readyState !== 1) {
        resolve({ error: new Error(HIVE_SOCKET_ERR.CLOSED) });
      }

      this.ws.send(message);
      resolve();
    });
  }
}

const wsSocketClient = new SocketClient(CONNECTION_STRING);

export default wsSocketClient;
