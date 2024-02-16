// import Cookie from 'js-cookie';
import { message } from 'antd';

import config from './routes';
import { headers, getAuthHeaders } from './ApiClient';
import { getGuestAccessToken } from '../common/helpers/localStorageHelpers';
import { getValidTokenData } from '../common/helpers/getToken';

export const getImportVote = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.importProduct}${config.power}?user=${userName}`, {
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

export const getDuplicateVote = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.duplicateList}${config.power}?user=${userName}`, {
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

export const getAthorityVote = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.authority}${config.power}?user=${userName}`, {
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

export const getAuthorityList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.authority}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const setImportVote = async (user, minVotingPower) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.importProduct}${config.power}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const setDuplicateVote = async (user, minVotingPower) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.duplicateList}${config.power}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const setClaimAuthorityVote = async (user, minVotingPower) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.authority}${config.power}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const uploadObject = async data => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.importProduct}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: data,
  })
    .then(response => response)
    .catch(e => e);
};

export const getImportedObjects = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.importProduct}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getHistoryImportedObjects = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.importProduct}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getDuplicatedList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.duplicateList}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getHistoryDuplicatedList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.duplicateList}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getHistoryAuthorityObjects = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.authority}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const createAuthority = async (
  user,
  authorPermlink,
  scanEmbedded,
  authority = 'administrative',
) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.authority}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
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
};

export const deleteAuthority = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.authority}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const changeAuthority = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.authority}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const setObjectImport = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.importProduct}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const setDuplicateList = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.duplicateList}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const deleteObjectImport = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.importProduct}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const deleteDuplicateList = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.duplicateList}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const getAmazonAsins = async uri => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.amazonAsins}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
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
};

export const getDepartmentsList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.departments}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const setDepartmentsBotVote = async (user, minVotingPower) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.departments}${config.power}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const deleteDepartments = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.departments}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const getHistoryDepartmentsObjects = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.departments}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getDepartmentsVote = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.departments}${config.power}?user=${userName}`, {
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

export const changeDepartments = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.departments}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const createDepartment = async (user, authorPermlink, scanEmbedded) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.departments}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
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
};

export const createDuplicateList = async (user, authorPermlink, scanEmbedded) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.duplicateList}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
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
};

export const createDescription = async (user, authorPermlink, scanEmbedded) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.descriptionBot}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
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
};

export const getDescriptionsList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.descriptionBot}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const changeDescriptions = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.descriptionBot}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const deleteDescriptions = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.descriptionBot}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const getHistoryDescriptionsObjects = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.descriptionBot}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getDescriptionsVote = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.descriptionBot}${config.power}?user=${userName}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};
export const setDescriptionsBotVote = async (user, minVotingPower) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.descriptionBot}${config.power}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
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
};

export const getGuestImportStatus = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.guest}${config.authorizeImport}?account=${userName}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};
export const setGuestImportStatus = async (userName, importAuthorization) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.guest}${config.authorizeImport}?account=${userName}`,
    {
      headers: {
        ...headers,
        ...(isGuest
          ? { 'access-token': token.token, 'waivio-auth': true }
          : { ...getAuthHeaders() }),
      },
      body: JSON.stringify({
        account: userName,
        importAuthorization,
      }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export default null;
