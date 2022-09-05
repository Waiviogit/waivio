import apiConfig from '../../waivioApi/routes';
import { parseJSON } from '../helpers/parseJSON';

const socketStore = {
  websocket: undefined,
  get instance() {
    return this.websocket;
  },
  set instance(instance) {
    this.websocket = instance;
  },
};

const socketFactory = () => {
  let socket = {};

  if (typeof WebSocket !== 'undefined') {
    socket = new WebSocket(`wss://${apiConfig[process.env.NODE_ENV].host}/notifications-api`);

    socket.sendAsync = (message, params) => {
      socket.send(
        JSON.stringify({
          method: message,
          params,
        }),
      );
    };

    socket.subscribeBlock = (type, blockNum, callback) => {
      const listener = e => {
        const data = parseJSON(e.data);

        if (type === data.type && data.notification.blockParsed === blockNum) {
          socket.removeEventListener('message', listener);
          callback();
        }
      };

      socket.addEventListener('message', listener);
    };

    socket.subscribe = callback => {
      const handler = e => callback(null, parseJSON(e.data));

      socket.addEventListener('message', handler);
    };

    socket.addEventListener('close', () => {
      socketStore.instance = socketFactory();
    });
  }

  return socket;
};

function createBusyAPI() {
  if (typeof document !== 'undefined') {
    socketStore.instance = socketFactory();
  }

  return socketStore;
}

export default createBusyAPI;
