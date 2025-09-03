import fetch from 'isomorphic-fetch';
import config, { baseUrl } from './routes';
import { headers, getAuthHeaders } from './ApiClient';
import { getGuestAccessToken } from '../common/helpers/localStorageHelpers';
import { getValidTokenData } from '../common/helpers/getToken';

export const getChatBotHistory = async id => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${baseUrl}${config.assistant}${config.history}/${id}`, {
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

export const sendChatBotQuestion = async (query, id, userName, images, currentPageContent) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${baseUrl}${config.assistant}`, {
    headers: {
      ...headers,
      app: config.appName,
      ...(isGuest
        ? {
            'access-token': token.token,
            'waivio-auth': true,
          }
        : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      query,
      id,
      images,
      currentPageContent,
    }),
  })
    .then(res => res.json())
    .catch(error => error);
};
export const updateAIKnowledge = async (userName, host) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}${config.assistant}${config.custom}`, {
    headers: {
      ...headers,
      app: config.appName,
      ...(isGuest
        ? {
            'access-token': token.token,
            'waivio-auth': true,
          }
        : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      host,
    }),
  })
    .then(res => res.json())
    .catch(error => error);
};
