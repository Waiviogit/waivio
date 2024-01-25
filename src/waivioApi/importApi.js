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

export const getDuplicateVote = userName =>
  fetch(`${config.importApiPrefix}${config.duplicateList}${config.power}?user=${userName}`, {
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

export const getAuthorityList = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.authority}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
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

export const setDuplicateVote = (user, minVotingPower) =>
  fetch(`${config.importApiPrefix}${config.duplicateList}${config.power}`, {
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

export const getImportedObjects = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.importProduct}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHistoryImportedObjects = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.importProduct}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getDuplicatedList = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.duplicateList}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHistoryDuplicatedList = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.duplicateList}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHistoryAuthorityObjects = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.authority}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
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
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    });

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

export const setDuplicateList = (user, status, importId) =>
  fetch(`${config.importApiPrefix}${config.duplicateList}`, {
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

export const deleteDuplicateList = (user, importId) =>
  fetch(`${config.importApiPrefix}${config.duplicateList}`, {
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

export const getDepartmentsList = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.departments}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const setDepartmentsBotVote = (user, minVotingPower) =>
  fetch(`${config.importApiPrefix}${config.departments}${config.power}`, {
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

export const deleteDepartments = (user, importId) =>
  fetch(`${config.importApiPrefix}${config.departments}`, {
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

export const getHistoryDepartmentsObjects = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.departments}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getDepartmentsVote = userName =>
  fetch(`${config.importApiPrefix}${config.departments}${config.power}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const changeDepartments = (user, status, importId) =>
  fetch(`${config.importApiPrefix}${config.departments}`, {
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

export const createDepartment = (user, authorPermlink, scanEmbedded) =>
  fetch(`${config.importApiPrefix}${config.departments}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'POST',
    body: JSON.stringify({
      user,
      authorPermlink,
      scanEmbedded,
    }),
  })
    .then(res => res.json())
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    });

export const createDuplicateList = (user, authorPermlink, scanEmbedded) =>
  fetch(`${config.importApiPrefix}${config.duplicateList}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'POST',
    body: JSON.stringify({
      user,
      authorPermlink,
      scanEmbedded,
    }),
  })
    .then(res => res.json())
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    });

export const createDescription = (user, authorPermlink, scanEmbedded) =>
  fetch(`${config.importApiPrefix}${config.descriptionBot}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'POST',
    body: JSON.stringify({
      user,
      authorPermlink,
      scanEmbedded,
    }),
  })
    .then(res => res.json())
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    });

export const getDescriptionsList = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.descriptionBot}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const changeDescriptions = (user, status, importId) =>
  fetch(`${config.importApiPrefix}${config.descriptionBot}`, {
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

export const deleteDescriptions = (user, importId) =>
  fetch(`${config.importApiPrefix}${config.descriptionBot}`, {
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

export const getHistoryDescriptionsObjects = (userName, skip, limit) =>
  fetch(
    `${config.importApiPrefix}${config.descriptionBot}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getDescriptionsVote = userName =>
  fetch(`${config.importApiPrefix}${config.descriptionBot}${config.power}?user=${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const setDescriptionsBotVote = (user, minVotingPower) =>
  fetch(`${config.importApiPrefix}${config.descriptionBot}${config.power}`, {
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

export default null;
