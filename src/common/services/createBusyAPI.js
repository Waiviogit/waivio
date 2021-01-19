import apiConfig from '../../waivioApi/routes';

function createBusyAPI() {
  const socket = new WebSocket(`wss://${apiConfig[process.env.NODE_ENV].host}/notifications-api`);

  socket.sendAsync = (message, params) =>
    socket.send(
      JSON.stringify({
        method: message,
        params,
      }),
    );

  socket.subscribe = callback => {
    socket.addEventListener('message', e => callback(null, JSON.parse(e.data)));
  };

  if (socket.readyState === socket.CLOSED) createBusyAPI();

  return socket;
}

export default createBusyAPI;
