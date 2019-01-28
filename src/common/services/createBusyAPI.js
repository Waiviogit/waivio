import { Client } from 'busyjs';

function createBusyAPI() {
  const client = new Client('ws://waiviodev.com/notifications');

  client.sendAsync = (message, params) =>
    new Promise((resolve, reject) => {
      client.call(message, params, (err, result) => {
        if (err !== null) return reject(err);
        return resolve(result);
      });
    });

  return client;
}

export default createBusyAPI;
