import WebSocket from 'ws';
import events from 'events';

const emitter = new events.EventEmitter();

const REQUESTS_TO_DISABLE = 15;
const REQUESTS_TO_RENEW = 3000;

const HIVE_SOCKET_ERR = {
  ERROR: 'error socket closed',
  DISABLED: 'socket disabled',
  CLOSED: 'connection close',
  TIMEOUT: 'Timeout exceed',
};

class SocketClient {
  constructor(url, key = '') {
    this.url = url;
    this.timeoutCount = 0;
    this.key = key;
  }

  async init() {
    return new Promise(resolve => {
      this.ws = new WebSocket(this.url, { headers: { 'api-key': this.key } });
      this.ws.on('error', error => {
        console.error('testSitemap line 28', error);
        this.ws.close();
        resolve({ error: new Error(HIVE_SOCKET_ERR.ERROR) });
      });

      this.ws.on('message', message => {
        try {
          console.error('testSitemap line 35', message);
          const data = JSON.parse(message.toString());

          emitter.emit(data.id, { data, error: data.error });
          // eslint-disable-next-line no-empty
        } catch (error) {
          console.error('testSitemap line 41', message);
        }
      });

      this.ws.on('open', () => {
        console.error('testSitemap line 46');
        setTimeout(() => {
          resolve(this.ws);
        }, 5000);
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getUniqId() {
    return `${Date.now().toString()}#${Math.random()
      .toString(36)
      .substr(2, 9)}`;
  }

  async sendMessage(message = {}) {
    if (this.timeoutCount >= REQUESTS_TO_DISABLE) {
      this.timeoutCount++;
      if (this.timeoutCount > REQUESTS_TO_RENEW) {
        this.timeoutCount = 0;
      }

      return { error: new Error(HIVE_SOCKET_ERR.TIMEOUT) };
    }
    if (!this.ws || this.ws.readyState === undefined) {
      console.error('testSitemap line 71', this?.ws?.readyState);
      await this.init();
    }

    return new Promise(resolve => {
      if (this.ws.readyState !== 1) {
        console.error('testSitemap line 77', this?.ws?.readyState);
        resolve({ error: new Error(HIVE_SOCKET_ERR.CLOSED) });
      }

      const id = this.getUniqId();

      // eslint-disable-next-line no-param-reassign
      message.id = id;
      this.ws.send(JSON.stringify(message));
      emitter.once(id, ({ data, error }) => {
        console.error('testSitemap line 87', data, error);
        if (error) resolve({ error });
        resolve(data);
      });

      setTimeout(() => {
        if (emitter.eventNames().includes(id)) {
          console.error('testSitemap line 97');
          this.timeoutCount++;
          emitter.off(id, () => {});
          resolve({ error: new Error(HIVE_SOCKET_ERR.TIMEOUT) });
        }
      }, 2 * 1000);
    });
  }
}

export default SocketClient;
