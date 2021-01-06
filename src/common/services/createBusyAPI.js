import { Client } from 'busyjs';
import apiConfig from '../../waivioApi/routes';

function createBusyAPI() {
  const client = new Client(`wss://${apiConfig[process.env.NODE_ENV].host}/notifications-api`);

  client.sendAsync = (message, params) =>
    new Promise((resolve, reject) => {
      client.call(message, params, (err, result) => {
        if (err !== null) return reject(err);

        return resolve(result);
      });
    });

  client.ws.onclose = () => {
    console.log('Socket closing, reconnect');
    createBusyAPI();
  };

  return client;
}

export default createBusyAPI;
