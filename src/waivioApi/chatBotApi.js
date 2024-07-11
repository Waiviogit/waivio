import fetch from 'isomorphic-fetch';
import config from './routes';
import { headers, getAuthHeaders } from './ApiClient';
import { getGuestAccessToken } from '../common/helpers/localStorageHelpers';
import { getValidTokenData } from '../common/helpers/getToken';

export const getChatBotHistory = async id => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.assistant}${config.history}/${id}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const sendChatBotQuestion = (question, id) =>
  fetch(`${config.apiPrefix}${config.assistant}`, {
    headers: { ...headers, app: config.appName },
    method: 'POST',
    body: JSON.stringify({
      question,
      id,
    }),
  })
    .then(res => res.json())
    .catch(error => error);
