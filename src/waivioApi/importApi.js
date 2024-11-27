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
export const hasAccessToImport = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.importProduct}${config.validate}?user=${userName}`,
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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

export const getTagsList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.tagsBot}?user=${userName}&skip=${skip}&limit=${limit}`,
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
      ...getAuthHeaders(),
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
export const setTagsBotVote = async (user, minVotingPower) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.tagsBot}${config.power}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
export const deleteTags = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.tagsBot}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
export const getHistoryTagsObjects = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.tagsBot}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
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
export const getTagsVote = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.tagsBot}${config.power}?user=${userName}`, {
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
      ...getAuthHeaders(),
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
export const changeTags = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.tagsBot}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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

export const createTags = async (user, authorPermlink, scanEmbedded) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.tagsBot}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
export const createMessage = async (
  groupPermlink,
  pagePermlink,
  dailyLimit,
  limit,
  skip,
  user,
  avoidRepetition,
  locale,
) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.threads}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      groupPermlink,
      pagePermlink,
      user,
      limit,
      dailyLimit,
      skip,
      avoidRepetition,
      locale,
    }),
  })
    .then(res => res.json())
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    });
};
export const createReposting = async (user, host, dailyLimit, posts) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      user,
      host,
      dailyLimit,
      posts,
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
export const getMessagesList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.threads}?user=${userName}&skip=${skip}&limit=${limit}`,
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
export const getRepostingList = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.postImport}?user=${userName}&skip=${skip}&limit=${limit}`,
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
      ...getAuthHeaders(),
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
export const changeMessages = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.threads}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
export const changeReposting = async (user, status, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
      ...getAuthHeaders(),
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
export const deleteMessage = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.threads}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
export const deleteReposting = async (user, importId) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
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
export const getHistoryMessageBot = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.threads}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
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
export const getHistoryRepostingBot = async (userName, skip, limit) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.importApiPrefix}${config.postImport}${config.history}?user=${userName}&skip=${skip}&limit=${limit}`,
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
      ...getAuthHeaders(),
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

export const getMessageBotRc = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.threads}${config.rc}?user=${userName}`, {
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
export const getRepostingBotRc = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}${config.rc}?user=${userName}`, {
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

export const changeMessageBotRc = async (user, minRc) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.threads}${config.rc}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'PUT',
    body: JSON.stringify({
      user,
      minRc,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};
export const changeRepostingBotRc = async (user, minRc) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}${config.rc}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'PUT',
    body: JSON.stringify({
      user,
      minRc,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getRepostingBotHost = async userName => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}${config.host}?user=${userName}`, {
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

export const changeRepostingBotHost = async (user, host) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.importApiPrefix}${config.postImport}${config.host}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'PUT',
    body: JSON.stringify({
      user,
      host,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export default null;
