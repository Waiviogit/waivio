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

      this.ws.on('error', () => {
        console.error('error socket closed');
        this.ws.close();
        resolve({ error: new Error(HIVE_SOCKET_ERR.ERROR) });
      });

      this.ws.on('message', message => {
        try {
          const data = JSON.parse(message.toString());

          emitter.emit(data.id, { data, error: data.error });
          // eslint-disable-next-line no-empty
        } catch (error) {}
      });

      this.ws.on('open', () => {
        setTimeout(() => {
          resolve(this.ws);
        }, 100);
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
      if (this.timeoutCount >= REQUESTS_TO_RENEW) {
        this.timeoutCount = 0;
      }

      return { error: new Error(HIVE_SOCKET_ERR.TIMEOUT) };
    }

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.init();
    }

    return new Promise(resolve => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        // eslint-disable-next-line no-console
        console.log(HIVE_SOCKET_ERR.CLOSED);
        resolve({ error: new Error(HIVE_SOCKET_ERR.CLOSED) });

        return;
      }

      const id = this.getUniqId();

      // eslint-disable-next-line no-param-reassign
      message.id = id;
      this.ws.send(JSON.stringify(message));

      const onMessageReceived = ({ data, error }) => {
        if (error) {
          resolve({ error });
        } else {
          resolve(data);
        }
        emitter.off(id, onMessageReceived);
      };

      emitter.once(id, onMessageReceived);

      setTimeout(() => {
        if (emitter.eventNames().includes(id)) {
          // eslint-disable-next-line no-console
          console.log(HIVE_SOCKET_ERR.TIMEOUT);
          this.timeoutCount++;
          emitter.off(id, onMessageReceived);
          resolve({ error: new Error(HIVE_SOCKET_ERR.TIMEOUT) });
        }
      }, 2 * 1000);
    });
  }
}

export default SocketClient;
