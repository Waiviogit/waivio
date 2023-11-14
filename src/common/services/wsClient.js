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

      const onOpen = () => {
        this.timeoutCount = 0;
        resolve(this.ws);
      };

      const onError = () => {
        console.error('error socket closed');
        this.ws.close();
        resolve({ error: new Error(HIVE_SOCKET_ERR.ERROR) });
      };

      const onClose = () => {
        this.timeoutCount++;
        this.ws.removeEventListener('open', onOpen);
        this.ws.removeEventListener('error', onError);
        this.ws.removeEventListener('close', onClose);

        setTimeout(() => {
          this.init().then(resolve);
        }, 1000); // Wait for 1 second before attempting to reconnect
      };

      this.ws.addEventListener('open', onOpen);
      this.ws.addEventListener('error', onError);
      this.ws.addEventListener('close', onClose);

      this.ws.on('message', message => {
        try {
          const data = JSON.parse(message.toString());

          emitter.emit(data.id, { data, error: data.error });
        } catch (error) {
          console.error('Error parsing message:', error.message);
        }
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
    if (this?.ws?.readyState !== 1) {
      await this.init();
    }

    return new Promise(resolve => {
      if (this.ws.readyState !== 1) {
        resolve({ error: new Error(HIVE_SOCKET_ERR.CLOSED) });
      }

      const id = this.getUniqId();

      // eslint-disable-next-line no-param-reassign
      message.id = id;
      this.ws.send(JSON.stringify(message));
      emitter.once(id, ({ data, error }) => {
        if (error) resolve({ error });
        resolve(data);
      });

      setTimeout(() => {
        if (emitter.eventNames().includes(id)) {
          this.timeoutCount++;
          emitter.off(id, () => {});
          resolve({ error: new Error(HIVE_SOCKET_ERR.TIMEOUT) });
        }
      }, 2 * 1000);
    });
  }
}

export default SocketClient;
