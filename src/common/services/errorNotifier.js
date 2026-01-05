import pkg from 'uuid';
const { v4: uuidv4 } = pkg;
import wsSocketClient from './wsClient.js';

// Telegram max length message 4096 + we add additional text on notifier
const maxLength = 4096 - 200;

const divideString = (input, length) => {
  const result = [];

  for (let i = 0; i < input.length; i += length) {
    result.push(input.slice(i, i + length));
  }

  return result;
};

const errorFormatter = (error, origin) => {
  const string = `
  stack: ${error.stack}
  message: ${error.message}
  origin: ${origin}`;

  return divideString(string, maxLength);
};

const restartNotifier = async (messages = []) => {
  if (!messages?.length) return;
  const firstMessage = JSON.stringify({
    method: 'clientError',
    params: [uuidv4(), `SSR error: ${messages[0]}`],
  });

  await wsSocketClient.sendMessage(firstMessage);
  for (let i = 1; i < messages.length; i++) {
    const message = JSON.stringify({
      method: 'clientError',
      params: [uuidv4(), messages[i]],
    });

    // eslint-disable-next-line no-await-in-loop
    await wsSocketClient.sendMessage(message);
  }
};

// eslint-disable-next-line import/prefer-default-export
export const restartHandler = async (error, origin) =>
  restartNotifier(errorFormatter(error, origin));
