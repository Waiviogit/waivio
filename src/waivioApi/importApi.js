import Cookie from 'js-cookie';
import { message } from 'antd';

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

export const getAthorityVote = userName =>
  fetch(`${config.importApiPrefix}${config.authority}${config.power}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getAuthorityList = userName =>
  fetch(`${config.importApiPrefix}${config.authority}?user=${userName}`, {
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

export const setClaimAuthorityVote = (user, minVotingPower) =>
  fetch(`${config.importApiPrefix}${config.authority}${config.power}`, {
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
      'access-token': Cookie.get('access_token'),
    },
    method: 'POST',
    body: data,
  })
    .then(response => response)
    .catch(e => e);

export const getImportedObjects = userName =>
  fetch(`${config.importApiPrefix}${config.importProduct}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHistoryImportedObjects = userName =>
  fetch(`${config.importApiPrefix}${config.importProduct}${config.history}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHistoryAuthorityObjects = userName =>
  fetch(`${config.importApiPrefix}${config.authority}${config.history}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const createAuthority = (user, authorPermlink, scanEmbedded, authority = 'administrative') =>
  fetch(`${config.importApiPrefix}${config.authority}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'POST',
    body: JSON.stringify({
      user,
      authorPermlink,
      authority,
      scanEmbedded,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const deleteAuthority = (user, importId) =>
  fetch(`${config.importApiPrefix}${config.authority}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'DELETE',
    body: JSON.stringify({
      user,
      importId,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const changeAuthority = (user, status, importId) =>
  fetch(`${config.importApiPrefix}${config.authority}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'PUT',
    body: JSON.stringify({
      user,
      status,
      importId,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const setObjectImport = (user, status, importId) =>
  fetch(`${config.importApiPrefix}${config.importProduct}`, {
    headers: {
      ...headers,
      'access-token': Cookie.get('access_token'),
    },
    method: 'PUT',
    body: JSON.stringify({
      user,
      status,
      importId,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const deleteObjectImport = (user, importId) =>
  fetch(`${config.importApiPrefix}${config.importProduct}`, {
    headers: {
      ...headers,
      'access-token': Cookie.get('access_token'),
    },
    method: 'DELETE',
    body: JSON.stringify({
      user,
      importId,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getAmazonAsins = uri =>
  fetch(`${config.importApiPrefix}${config.amazonAsins}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      uri,
    }),
  })
    .then(res => res.json())
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    });

export default null;
