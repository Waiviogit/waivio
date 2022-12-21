import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';

import config from './routes';
import { headers } from './ApiClient';

export const getImportVote = userName =>
  fetch(`${config.importApiPrefix}${config.importProduct}${config.power}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const setImportVote = (user, minVotingPower) =>
  fetch(`${config.importApiPrefix}${config.importProduct}${config.power}`, {
    headers: {
      ...headers,
      'access-token': Cookie.get('access_token'),
    },
    method: 'PUT',
    body: JSON.stringify({
      user,
      minVotingPower,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const uploadObject = data =>
  fetch(`${config.importApiPrefix}${config.importProduct}`, {
    headers: {
      ...headers,
      'access-token': Cookie.get('access_token'),
      'Content-Type': 'multipart/form-data',
    },
    method: 'POST',
    formData: data,
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export default null;
