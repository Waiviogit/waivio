/* eslint-disable */
import { isEmpty, omit, ceil, includes, has, sample } from 'lodash';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import { message } from 'antd';
import store from 'store';
import { campaignTypes } from '../client/rewards/rewardsHelper';

import config, { baseUrl } from './routes';
import { getValidTokenData } from '../common/helpers/getToken';
import { GUEST_ACCOUNT_UPDATE, CUSTOM_JSON } from '../common/constants/accountHistory';
import { getGuestAccessToken } from '../common/helpers/localStorageHelpers';
import { isMobileDevice } from '../common/helpers/apiHelpers';
import { createQuery, parseQuery } from './helpers';
import { TRANSACTION_TYPES } from '../client/wallet/WalletHelper';
import {
  excludeHashtagObjType,
  listOfMapObjectTypes,
  recommendedObjectTypes,
} from '../common/constants/listOfObjectTypes';
// getGuestAccessToken() ||
export const getAuthHeaders = () => ({
  'access-token': Cookie.get('access_token'),
  'hive-auth': Boolean(Cookie.get('auth')),
  'waivio-auth': Boolean(store.get('accessToken')),
});

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  ...isMobileDevice(),
};
const addAppHost = host => (typeof window === 'undefined' ? { 'app-host': host } : {});

const WAIVIdPool = 13;
const REQUEST_TIMEOUT = 3000;
const HIVE_ENGINE_NODES = [
  'https://herpc.dtools.dev',
  'https://api.hive-engine.com/rpc',
  'https://enginerpc.com',
  'https://herpc.kanibot.com',
  'https://he.sourov.dev',
  'https://engine.waivio.com',
];

const getNewNodeUrl = hostUrl => {
  const index = hostUrl ? HIVE_ENGINE_NODES?.indexOf(hostUrl) : 0;

  return index === HIVE_ENGINE_NODES.length - 1
    ? HIVE_ENGINE_NODES[0]
    : HIVE_ENGINE_NODES[index + 1];
};

export const engineQuery = async ({ hostUrl, params, endpoint = '/contracts' }) =>
  fetch(
    `${hostUrl}${endpoint}`,
    {
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'ssc-mainnet-hive',
        method: 'find',
        params,
      }),
      method: 'POST',
    },
    {
      timeout: REQUEST_TIMEOUT,
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response.result)
    .catch(error => {
      console.error('API Client error:', error);

      return { error };
    });

export const engineProxy = async (params, attempts = 5, hostUrl = HIVE_ENGINE_NODES[0]) => {
  const response = await engineQuery({
    params,
    hostUrl,
  });

  if (has(response, 'error') || !response) {
    if (attempts <= 0) return response;
    const newUrl = getNewNodeUrl(hostUrl);

    return engineProxy(params, attempts - 1, newUrl);
  }

  return response;
};

export function handleErrors(response) {
  if (!response.ok) {
    return Promise.reject(response);
  }

  return response;
}

export const getRecommendedObjects = (locale = 'en-US') =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: { ...headers, app: config.appName, locale },
    method: 'POST',
    body: JSON.stringify({
      userLimit: 5,
      locale,
      limit: 6,
      object_types: recommendedObjectTypes,
      sample: true,
    }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getObjects = ({
  limit = 30,
  locale = 'en-US',
  skip = 0,
  isOnlyHashtags,
  follower,
}) => {
  const reqData = { limit, locale, skip };

  if (isOnlyHashtags) reqData.object_types = ['hashtag'];
  else reqData.object_types = excludeHashtagObjType;

  return fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: {
      ...headers,
      app: config.appName,
      follower,
      locale,
    },
    method: 'POST',
    body: JSON.stringify(reqData),
  })
    .then(res => res.json())
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getObjectsByIds = ({
  authorPermlinks = [],
  authUserName = '',
  locale = 'en-US',
  limit = 30,
  skip,
  host,
}) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: {
      ...headers,
      app: config.appName,
      follower: authUserName,
      locale,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({
      author_permlinks: authorPermlinks,
      limit,
      skip,
      locale,
    }),
  })
    .then(res => res.json())
    .catch(error => []);

export const getObject = (authorPermlink, user, locale, host, abortController) => {
  const queryString = user ? `?user=${user}` : '';

  return fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${queryString}`, {
    headers: {
      ...headers,
      app: config.appName,
      follower: user,
      locale,
      ...addAppHost(host),
      ...(abortController && { signal: abortController.signal }),
    },
  })
    .then(res => Promise.resolve(res.json()))
    .catch(Promise.reject);
};

export const getUsersByObject = object =>
  fetch(`${config.apiPrefix}${config.getObjects}/${object}`).then(res => res.json());

// region WebsiteFeed requests
export const getFeedContentByObject = (
  name,
  limit = 10,
  user_languages,
  locale,
  follower,
  newsPermlink,
  host,
) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${name}${config.posts}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
      follower,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({ limit, user_languages, newsPermlink }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getPinnedPostsByObject = (name, locale, follower, host) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${name}${config.pin}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
      follower,
      ...addAppHost(host),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

// eslint-disable-next-line camelcase
export const getMoreFeedContentByObject = ({
  authorPermlink,
  skip = 0,
  limit = 10,
  user_languages,
  lastId,
  locale,
  newsPermlink,
}) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.posts}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
    },
    method: 'POST',
    body: JSON.stringify({ skip, limit, user_languages, lastId, newsPermlink }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getFeedContent = (sortBy, locale, follower, queryData) =>
  fetch(`${config.apiPrefix}${config.posts}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
      follower,
    },
    method: 'POST',
    body: JSON.stringify(queryData),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMentionsPosts = (authUserName, account, skip, limit) =>
  fetch(`${config.apiPrefix}${config.posts}${config.mentions}`, {
    headers: {
      ...headers,
      app: config.appName,
      follower: authUserName,
    },
    method: 'POST',
    body: JSON.stringify({ skip, limit, account }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const saveDraftPage = (user, authorPermlink, body) =>
  fetch(`${config.apiPrefix}${config.draft}${config.object}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      user,
      body,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getDraftPage = (user, authorPermlink) => {
  const query = createQuery({ authorPermlink, user });

  return fetch(`${config.apiPrefix}${config.draft}${config.object}?${query}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getUserProfileBlog = (
  userName,
  follower,
  { limit = 10, skip },
  locale = 'en-US',
  tagsArray,
) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.blog}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
      ...(follower && { follower }),
    },
    method: 'POST',
    body: JSON.stringify({
      limit,
      skip,
      ...(isEmpty(tagsArray) ? {} : { tagsArray }),
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUserLastActivity = userName =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.lastActivity}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res.lastActivity)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const chechExistUser = userName =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.existHive}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res.result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUserFeedContent = (feedUserName, limit = 10, user_languages, locale, host) =>
  fetch(`${config.apiPrefix}${config.user}/${feedUserName}${config.feed}`, {
    headers: {
      ...headers,
      locale,
      app: config.appName,
      follower: feedUserName,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({ limit, user_languages }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMoreUserFeedContent = ({
  userName,
  limit = 10,
  skip = 0,
  user_languages,
  lastId,
  locale,
}) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.feed}`, {
    headers: { ...headers, app: config.appName, locale, follower: userName },
    method: 'POST',
    body: JSON.stringify({
      skip,
      limit,
      user_languages,
      lastId,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
// endregion

export const postCreateWaivioObject = requestBody =>
  fetch(`${config.objectsBotApiPrefix}${config.objectsBot.createObject}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const validateAppend = requestBody =>
  fetch(`${config.objectsBotApiPrefix}${config.objectsBot.appendObject}${config.validate}`, {
    method: 'POST',
    headers: {
      ...headers,
    },
    body: JSON.stringify(requestBody),
  })
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getContent = (author, permlink = '', locale, follower) => {
  if (follower) headers.follower = follower;
  const link = permlink?.includes(`${author}/`) ? permlink : `${author}/${permlink}`;

  return fetch(`${config.apiPrefix}${config.post}/${link}`, {
    headers: { ...headers, app: config.appName, locale },
    method: 'GET',
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const searchObjects = (
  searchString,
  objType = '',
  forParent,
  limit = 15,
  locale,
  body = {},
  abortController,
  skip,
  onlyObjectTypes,
) => {
  const requestBody = { search_string: searchString.toLowerCase(), limit, skip, ...body };

  if (objType && typeof objType === 'string') requestBody.object_type = objType;
  if (forParent && typeof forParent === 'string') requestBody.forParent = forParent;
  if (onlyObjectTypes) requestBody.onlyObjectTypes = onlyObjectTypes;

  return fetch(`${config.apiPrefix}${config.searchObjects}`, {
    headers: { ...headers, locale, follower: body.userName, app: config.appName },
    method: 'POST',
    body: JSON.stringify(requestBody),
    ...(abortController && { signal: abortController.signal }),
  })
    .then(handleErrors)
    .then(res => res.json());
};
export const extendedSearchObjects = (
  searchString,
  objType = '',
  forParent,
  limit = 15,
  locale,
  body = {},
  abortController,
  skip,
) => {
  const requestBody = { search_string: searchString, limit, skip, ...body };

  if (objType && typeof objType === 'string') requestBody.object_type = objType;
  if (forParent && typeof forParent === 'string') requestBody.forParent = forParent;

  return fetch(`${config.apiPrefix}${config.wobjects}${config.searchDefault}`, {
    headers: { ...headers, locale, follower: body.userName, app: config.appName },
    method: 'POST',
    body: JSON.stringify(requestBody),
    ...(abortController && { signal: abortController.signal }),
  })
    .then(handleErrors)
    .then(res => res.json());
};

export const searchUsers = (searchString, username, limit = 15, notGuest = false, skip = 0) =>
  fetch(
    `${config.apiPrefix}${config.users}${config.search}?${searchString &&
      `searchString=${searchString}&`}limit=${limit}&skip=${skip}&notGuest=${notGuest}`,
    {
      headers: {
        ...headers,
        following: username,
        follower: username,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const searchObjectTypes = (searchString, limit = 15, skip) => {
  const requestBody = { search_string: searchString, limit, skip };

  return fetch(`${config.apiPrefix}${config.objectTypesSearch}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(requestBody),
  }).then(res => res.json());
};

export const postAppendWaivioObject = postData =>
  fetch(`${config.objectsBotApiPrefix}${config.objectsBot.appendObject}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(postData),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

// region Follow API requests
export const getAllFollowingObjects = (username, skip, limit, authUser, locale) => {
  const actualHeaders = authUser ? { ...headers, follower: authUser, locale } : headers;

  return fetch(`${config.apiPrefix}${config.user}/${username}${config.followingObjects}`, {
    method: 'POST',
    headers: {
      ...actualHeaders,
      app: config.appName,
    },
    body: JSON.stringify({ limit, skip }),
  })
    .then(res => res.json())
    .then(res => res.map(obj => obj.author_permlink))
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getWobjectFollowers = (
  wobject,
  skip = 0,
  limit = 50,
  sort = 'recency',
  authUser,
  host,
) => {
  const actualHeaders = authUser
    ? { ...headers, following: authUser, follower: authUser }
    : headers;

  return fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getObjectFollowers}`, {
    headers: { ...actualHeaders, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({ skip, limit, sort }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(result => result || [])
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getWobjectFollowing = (userName, skip = 0, limit = 50, authUser, locale) => {
  const actualHeaders = authUser
    ? { ...headers, following: authUser, follower: authUser, locale }
    : headers;

  return fetch(`${config.apiPrefix}${config.user}/${userName}${config.followingObjects}`, {
    headers: {
      ...actualHeaders,
      app: config.appName,
    },
    method: 'POST',
    body: JSON.stringify({ skip, limit }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getUserAccount = (username, withFollowings = false, authUser) =>
  fetch(`${config.apiPrefix}${config.user}/${username}?with_followings=${withFollowings}`, {
    headers: {
      ...headers,
      follower: authUser,
      following: authUser,
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getFollowingUpdates = (locale, userName, count = 5) =>
  fetch(
    `${config.apiPrefix}${config.user}/${userName}${config.followingUpdates}?users_count=${count}&wobjects_count=${count}`,
    {
      headers: {
        ...headers,
        app: config.appName,
        locale,
      },
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getFollowingObjectsUpdates = (follower, objType, limit = 5, skip = 0) =>
  fetch(
    `${config.apiPrefix}${config.user}/${follower}${config.followingObjectsUpdates}?object_type=${objType}&limit=${limit}&skip=${skip}`,
    {
      headers: {
        follower,
        ...headers,
        app: config.appName,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getFollowingUsersUpdates = (userName, limit = 5, skip = 0) =>
  fetch(
    `${config.apiPrefix}${config.user}/${userName}${config.followingUsersUpdates}?limit=${limit}&skip=${skip}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
// endregion

export const getWobjectGallery = (wobject, locale, host) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getGallery}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
      ...addAppHost(host),
    },
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWobjectsWithUserWeight = (
  userName,
  skip = 0,
  limit = 30,
  authUser,
  objectTypes,
  locale,
  host,
) => {
  const reqData = { skip, limit };

  if (objectTypes) reqData.object_types = objectTypes;

  return fetch(`${config.apiPrefix}${config.user}/${userName}${config.wobjectsWithUserWeight}`, {
    headers: {
      ...headers,
      follower: authUser,
      app: config.appName,
      locale,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify(reqData),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getWobjectsExpertise = (user, authorPermlink, skip = 0, limit = 30, sort) => {
  const actualHeader = user ? { ...headers, following: user, follower: user } : headers;

  return fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.wobjectsExpertise}`,
    {
      headers: { ...actualHeader, app: config.appName },
      method: 'POST',
      body: JSON.stringify({ skip, limit, sort }),
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getWobjectsExpertiseWithNewsFilter = (
  user,
  authorPermlink,
  skip = 0,
  limit = 30,
  newsFilter,
  host,
) => {
  const actualHeader = user ? { ...headers, following: user, follower: user } : headers;

  return fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.wobjectsExpertise}`,
    {
      headers: { ...actualHeader, app: config.appName, ...addAppHost(host) },
      method: 'POST',
      body: JSON.stringify({ skip, limit, ...newsFilter }),
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getObjectExpertiseByType = (objectType, skip = 0, limit = 5) =>
  fetch(
    `${config.apiPrefix}${config.objectType}/${objectType}${config.typeExpertise}?limit=${limit}&skip=${skip}`,
    {
      headers: {
        ...headers,
        app: config.appName,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAuthorsChildWobjects = (
  authorPermlink,
  skip = 0,
  limit = 30,
  locale,
  excludeTypes = '',
  name,
  searchString,
) =>
  fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${
      config.childWobjects
    }?limit=${limit}&skip=${skip}${excludeTypes ? `&excludeTypes=${excludeTypes}` : ''}${
      searchString ? `&searchString=${searchString}` : ''
    }${name ? `&userName=${name}` : ''}`,
    {
      headers: {
        ...headers,
        app: config.appName,
        locale,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getObjectTypes = (limit = 10, skip = 0, wobjects_count = 3, locale) =>
  fetch(`${config.apiPrefix}${config.getObjectTypes}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
    },
    method: 'POST',
    body: JSON.stringify({ limit, skip, wobjects_count }),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getObjectType = (typeName, requestData, abortController, host) => {
  const { locale = 'en-US', userName } = requestData;

  return fetch(`${config.apiPrefix}${config.objectType}/${typeName}`, {
    headers: { ...headers, follower: userName, app: config.appName, locale, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify(requestData),
    ...(abortController && { signal: abortController.signal }),
  })
    .then(res => res.json())
    .then(data => data)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getSearchResult = (
  string,
  userLimit = 3,
  wobjectsLimit,
  objectTypesLimit = 5,
  user,
  locale,
  abortController,
  onlyObjectTypes,
) =>
  fetch(`${config.apiPrefix}${config.generalSearch}`, {
    headers: {
      ...headers,
      following: user,
      follower: user,
      app: config.appName,
      locale,
    },
    method: 'POST',
    body: JSON.stringify({ string, userLimit, wobjectsLimit, objectTypesLimit, onlyObjectTypes }),
    ...(abortController && { signal: abortController.signal }),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMoreObjectsByType = (type, skip, limit, filter = {}) =>
  fetch(`${config.apiPrefix}${config.objectType}/${type}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      object_types: [type],
      wobjects_skip: skip,
      wobjects_count: limit,
      filter,
    }),
  })
    .then(res => res.json())
    .then(result => ({ data: result, type }))
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getTopUsers = (user, { limit = 30, skip = 0, isRandom = false } = {}) => {
  const queryString = `?${isRandom ? 'sample=true' : `limit=${limit}&skip=${skip}`}`;
  const actualHeaders = user ? { ...headers, following: user, follower: user } : headers;

  return fetch(`${config.apiPrefix}${config.users}${queryString}`, {
    headers: actualHeaders,
    method: 'GET',
  })
    .then(res => res.json())
    .then(data => data)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

// region Campaigns Requests

export const getReviewCheckInfo = ({ campaignId, locale = 'en-US', userName, postPermlink }) => {
  const queryString = `${
    postPermlink ? `?userName=${userName}&postPermlink=${postPermlink}` : `?userName=${userName}`
  }`;

  return fetch(
    `${config.campaignApiPrefix}${config.campaign}${config.reviewCheck}/${campaignId}${queryString}`,
    {
      headers: {
        ...headers,
        app: config.appName,
        locale,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response.campaign)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getMatchBotRules = (guideName, limit, skip) =>
  fetch(
    `${config.campaignApiPrefix}${config.matchBots}/?bot_name=${guideName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getLenders = ({ sponsor, user, globalReport, filters }, skip = 0, limit = 30) => {
  const getBody = obj => {
    let preparedObject;

    if (!isEmpty(obj)) {
      preparedObject = {
        sponsor,
        globalReport,
        objects: obj.objects,
        endDate: obj.endDate,
        startDate: obj.startDate,
        currency: obj.currency,
        processingFees: obj.processingFees,
      };
      if (obj.payable && globalReport) {
        preparedObject = {
          ...preparedObject,
          payable: obj.payable,
        };
      }
      if (!globalReport) {
        if (sponsor) {
          preparedObject = {
            sponsor,
          };
        } else {
          preparedObject = {
            userName: user,
          };
        }

        if (obj.days || obj.moreDays || obj.otherDays)
          preparedObject.days = obj.days || obj.moreDays || obj.otherDays;
        if (obj.payable) preparedObject.payable = obj.payable;
      }

      return { ...preparedObject, skip, limit };
    }

    return {
      userName: user,
      sponsor,
      globalReport,
      skip,
      limit,
    };
  };

  return fetch(`${config.campaignApiPrefix}${config.payments}${config.payables}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(getBody(filters)),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getReport = ({ guideName, userName, reservationPermlink }) =>
  fetch(`${config.campaignApiPrefix}${config.payments}${config.report}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      guideName,
      userName,
      reservationPermlink,
    }),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
// endregion

// region UserMetadata Requests
export const getAuthenticatedUserMetadata = userName => {
  const { apiPrefix, user, userMetadata } = config;

  return fetch(`${apiPrefix}${user}/${userName}${userMetadata}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => omit(res.user_metadata, '_id'));
};

export const updateUserMetadata = async (userName, data) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.user}/${userName}${config.userMetadata}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'PUT',
    body: JSON.stringify({ user_metadata: data }),
  }).then(res => res.json());
};

export const getGuestPaymentsHistory = async (
  userName,
  { skip = 0, limit = 10 } = {},
  tableView = false,
  startDate,
  endDate,
) => {
  const token = await getValidTokenData();
  let url = `${config.campaignApiPrefix}${config.payments}${config.demoPayables}?userName=${userName}&skip=${skip}&limit=${limit}`;

  if (tableView) {
    url += `&tableView=${tableView}&startDate=${startDate}&endDate=${endDate}`;
  }

  return fetch(url, {
    headers: { ...headers, 'access-token': token.token, 'waivio-auth': true },
    method: 'GET',
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

// endregion

// region Guest user's requests
export const getAccessToken = (token, social, regData) => {
  const response = {};
  const body = {};

  body.access_token = token;

  if (!isEmpty(regData)) {
    Object.keys(regData).forEach(key => (body[key] = regData[key]));
  }

  return fetch(`${config.baseUrl}${config.auth}/${social}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
    .then(data => {
      response.accessToken = data.headers.get('access-token');
      response.expiration = data.headers.get('expires-in');
      response.refreshToken = data.headers.get('refresh-token');

      return data.json();
    })
    .then(data => {
      response.userData = data.user;

      return response;
    })
    .catch(err => err);
};

export const refreshToken = token => {
  const response = {};

  return fetch(`${config.baseUrl}${config.auth}/${config.refreshAuthToken}`, {
    method: 'POST',
    headers: { 'refresh-token': token },
  })
    .then(data => {
      response.accessToken = data.headers.get('access-token');
      response.refreshToken = data.headers.get('refresh-token');
      response.expiration = data.headers.get('expires-in');
      response.status = data.status;

      return response;
    })
    .catch(e => {
      console.error(e.message);
    });
};

export const isUserNameVacant = userName => fetch(`${config.baseUrl}${config.user}/${userName}`);

export const isUserRegistered = (id, socialNetwork) =>
  fetch(
    `${config.baseUrl}${config.auth}${config.hasSocialAccount}?id=${id}&provider=${socialNetwork}`,
  )
    .then(data => data.json())
    .then(data => data.result);

export const broadcastGuestOperation = async (operationId, data) => {
  const userData = await getValidTokenData();
  const isReview = includes(data[0][1].title, 'Review');

  if (userData.token) {
    let body;

    if (isReview) {
      body = {
        id: operationId,
        data: { operations: data },
        userName: userData.userData.name,
        guestReview: true,
      };
    } else if (operationId === 'website_guest') {
      body = {
        id: operationId,
        data: data[0][1],
        userName: userData.userData.name,
      };
    } else {
      body = {
        id: operationId,
        data: { operations: data },
        userName: userData.userData.name,
      };
    }

    return (
      fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
        method: 'POST',
        headers: { ...headers, 'access-token': userData.token },
        body: JSON.stringify(body),
      })
        // .then(res => res.json())
        .then(res => {
          if ([403].includes(res.status)) message.error('Something went wrong');

          return res;
        })
        .catch(e => {
          console.error(e);
        })
    );
  }
};
// endregion

export const getFollowersFromAPI = (username, limit = 10, skip = 0, sort = 'recency', follower) =>
  fetch(
    `${config.apiPrefix}${config.user}/${username}${config.getObjectFollowers}?skip=${skip}&limit=${limit}&sort=${sort}`,
    {
      headers: {
        ...headers,
        following: follower,
        follower,
      },
    },
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));

export const getFollowingsFromAPI = (
  username,
  limit = 100,
  skip = 0,
  authUser,
  sort = 'recency',
) => {
  const actualHeaders = authUser
    ? { ...headers, following: authUser, follower: authUser }
    : headers;

  return fetch(
    `${config.apiPrefix}${config.user}/${username}${config.followingUsers}?skip=${skip}&limit=${limit}&sort=${sort}`,
    {
      headers: actualHeaders,
    },
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

export const getGuestAvatarUrl = (username, url, intl) => {
  const formData = new FormData();

  formData.append('userName', username);
  formData.append('type', 'avatar');
  formData.append('imageUrl', url);

  return fetch(`https://www.waivio.com/api/image`, {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => data)
    .catch(err => {
      console.error('err', err);
      message.error(
        intl.formatMessage({
          id: 'notify_uploading_iamge_error',
          defaultMessage: "Couldn't upload image",
        }),
      );
    });
};

export const enhanceAvatarImage = async (imageUrl, objectPermlink) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  const formData = new FormData();

  formData.append('imageUrl', imageUrl);
  formData.append('objectPermlink', objectPermlink);
  formData.append('enhancementType', 'resolution');

  return fetch(`${config.apiPrefix}${config.enhanceAvatar}`, {
    method: 'POST',
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    body: formData,
  })
    .then(res => res.json())
    .then(response => {
      if (response.message) message.error(response.message);

      return response;
    })
    .catch(err => {
      console.error('Avatar enhancement error:', err);

      return { success: false, message: 'Failed to enhance avatar' };
    });
};

// eslint-disable-next-line camelcase
export const updateGuestProfile = async (username, json_metadata) => {
  const body = {
    id: 'waivio_guest_account_update',
    data: {
      operations: [
        [
          CUSTOM_JSON,
          {
            required_auths: [],
            required_posting_auths: [username],
            id: GUEST_ACCOUNT_UPDATE,
            json: JSON.stringify({
              account: username,
              json_metadata: '',
              posting_json_metadata: JSON.stringify({ ...json_metadata, version: 2 }),
            }),
          },
        ],
      ],
    },
  };
  const userData = await getValidTokenData();

  return fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
    method: 'POST',
    headers: { ...headers, 'access-token': userData.token },
    body: JSON.stringify(body),
  })
    .then(data => data)
    .catch(err => err.message);
};

export const sendGuestTransfer = async ({ to, amount, memo, app }) => {
  const userData = await getValidTokenData();
  const overpaymentRefund = includes(memo, 'overpayment_refund');
  const body = {
    id: overpaymentRefund ? 'overpayment_refund' : 'waivio_guest_transfer',
    data: { to, amount: +amount.split(' ')[0] },
  };

  if (app) body.app = app;
  if (memo && !overpaymentRefund) {
    body.data.memo = memo;
  } else {
    body.data.memo = '';
  }

  return fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
    method: 'POST',
    headers: { ...headers, 'access-token': userData.token },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);
};

export const deletePost = async ({ root_author, permlink, userName }) => {
  const userData = await getValidTokenData();

  const body = {
    id: 'waivio_guest_delete_comment',
    data: { root_author, permlink },
    userName,
  };

  return fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
    method: 'POST',
    headers: { ...headers, 'access-token': userData.token },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);
};

export const sendPendingTransfer = async ({ sponsor, userName, amount, transactionId, memo }) => {
  const body = {
    sponsor,
    userName,
    amount,
    transactionId,
    memo,
  };

  return fetch(`${config.campaignApiPrefix}${config.payments}${config.setPendingStatus}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(err => err);
};

export const getUserCommentsFromApi = (username, skip = 0, limit = 10, startPermlink, follower) => {
  let res;

  if (startPermlink) {
    res = fetch(
      `${config.apiPrefix}${config.user}/${username}${config.comments}?skip=${skip}&limit=${limit}&start_permlink=${startPermlink}`,
      {
        headers: {
          app: config.appName,
          follower,
        },
      },
    );
  } else {
    res = fetch(
      `${config.apiPrefix}${config.user}/${username}${config.comments}?skip=${skip}&limit=${limit}`,
      {
        headers: {
          app: config.appName,
          follower,
        },
      },
    );
  }

  return res
    .then(responsive => responsive.json())
    .then(data => data)
    .catch(err => err);
};

export const getPostCommentsFromApi = ({ category, author, permlink, locale, userName }) =>
  fetch(
    `${config.apiPrefix}${
      config.postComments
    }?author=${author}&permlink=${permlink}&category=${category}${
      userName ? `&userName=${userName}` : ''
    }`,
    {
      headers: {
        ...headers,
        app: config.appName,
        locale,
      },
    },
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => err);

export const getRecommendTopic = (limit = 30, locale = 'en-US', skip = 0, listHashtag) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: { ...headers, locale },
    method: 'POST',
    body: JSON.stringify({
      limit,
      skip,
      locale,
      author_permlinks: listHashtag,
      object_types: ['hashtag'],
    }),
  }).then(res => res.json());

export const getUsers = ({ listUsers, userName, skip = 0, limit = 20, locale }) => {
  const actualHeaders = userName
    ? { ...headers, following: userName, follower: userName, locale }
    : headers;

  return fetch(`${config.apiPrefix}${config.getUsers}`, {
    headers: {
      ...actualHeaders,
    },
    method: 'POST',
    body: JSON.stringify({
      users: listUsers,
      name: userName,
      skip,
      limit,
    }),
  }).then(res => res.json());
};

export const setUserStatus = user =>
  fetch(`${config.apiPrefix}${config.user}/${user}${config.setUserStatus}`, {
    headers,
    method: 'GET',
  }).then(res => res.json());

export const getBlacklist = userName =>
  fetch(`${config.campaignApiPrefix}${config.campaigns}/${userName}${config.blacklist}`, {
    headers,
    method: 'GET',
  }).then(res => res.json());

export const getWalletCryptoPriceHistory = symbols =>
  fetch(
    `${config.currenciesApiPrefix}${config.market}?ids=${symbols[0]}&ids=${symbols[1]}&currencies=usd&currencies=btc`,
    {
      headers,
      method: 'GET',
    },
  ).then(res => {
    if (res.status === 200) return res.json();
  });

export const getCurrentHivePrice = () =>
  fetch(`${config.currenciesApiPrefix}${config.reservationCurrency}`, {
    headers,
    method: 'GET',
  }).then(res => res.json());

export const checkFollowing = (user, users = []) => {
  const queryString = users.length
    ? users.reduce((acc, usr, index) => {
        if (index !== users.length - 1) return `${acc}users=${usr}&`;

        return `${acc}users=${usr}`;
      }, '?')
    : '';

  return fetch(`${config.apiPrefix}${config.user}/${user}/getFollowingsState${queryString}`, {
    headers,
    method: 'GET',
  }).then(res => res.json());
};

export const getDynamicGlobalPropertiesFromApi = () =>
  fetch(`${config.apiPrefix}/hive/global-properties`, {
    headers,
    method: 'GET',
  }).then(res => res.json());

export const estimateAmount = (inputAmount, inputCoinType, outputCoinType) => {
  const amount = isNaN(inputAmount) ? 0 : inputAmount;

  const query = `inputAmount=${ceil(
    amount,
    17,
  )}&inputCoinType=${inputCoinType}&outputCoinType=${outputCoinType}`;

  return fetch(
    `${config.campaignApiPrefix}${config.withdraw}${config.estimateOutputAmount}?${query}`,
    {
      headers,
      method: 'GET',
    },
  ).then(res => res.json());
};

export const confirmWithDraw = (userName, transactionData) =>
  fetch(`${config.campaignApiPrefix}${config.withdraw}${config.immediateWithdraw}`, {
    headers: { ...headers, 'access-token': store.get('accessToken') },
    method: 'POST',
    body: JSON.stringify({
      userName,
      transactionData,
    }),
  }).then(res => res.json());

export const sendEmailConfirmation = (userName, type, email, isGuest) => {
  const accessToken = isGuest ? store.get('accessToken') : Cookie.get('accessToken');
  let body = { userName, type, email, isGuest };

  if (type === 'confirmTransaction') {
    const transactionInfo = store.get('withdrawData');
    const amount = isNaN(transactionInfo.hiveAmount) ? 0 : transactionInfo.hiveAmount;
    const transactionData = {
      outputCoinType: transactionInfo.currentCurrency,
      inputCoinType: 'hive',
      amount,
      address: transactionInfo.walletAddress,
    };

    body = {
      ...body,
      transactionData,
    };
  }

  return fetch(`${config.campaignApiPrefix}${config.mailer}${config.confirmEmail}`, {
    headers: {
      ...headers,
      'access-token': accessToken,
    },
    method: 'POST',
    body: JSON.stringify(body),
  }).then(res => res.json());
};

export const validaveCryptoWallet = (address, crypto) =>
  fetch(`https://blocktrades.us/api/v2/wallets/${crypto}/address-validator?address=${address}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => ({ result: res.data }));

export const finalConfirmation = (token, isGuest) => {
  const accessToken = isGuest ? store.get('accessToken') : Cookie.get('accessToken');

  return fetch(
    `${config.campaignApiPrefix}${config.withdraw}${config.finalConfirmTransaction}?id=${token}`,
    {
      headers: {
        ...headers,
        'access-token': accessToken,
      },
      method: 'GET',
    },
  ).then(res => res.json());
};

export const getPrivateEmail = userName => {
  const { apiPrefix, user, userMetadata } = config;

  return fetch(`${apiPrefix}${user}/${userName}${userMetadata}?onlyEmail=true`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res.privateEmail);
};

export const getTransferDetails = withdrawId =>
  fetch(`${config.campaignApiPrefix}${config.withdraw}${config.getWithdrawData}?id=${withdrawId}`, {
    headers,
    method: 'GET',
  }).then(res => res.json());

export const getChangedField = (
  authorPermlink,
  fieldName,
  author,
  permlink,
  locale,
  authUser,
  abortController,
) =>
  fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.getField}?fieldName=${fieldName}&author=${author}&permlink=${permlink}`,
    {
      headers: {
        ...headers,
        app: config.appName,
        locale,
        follower: authUser,
      },
      method: 'GET',
      ...(abortController && { signal: abortController.signal }),
    },
  )
    .then(res => res.json())
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUpdateByBody = (authorPermlink, name, locale, body) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.rawField}`, {
    headers: {
      ...headers,
      locale,
    },
    body: JSON.stringify({
      name,
      body,
    }),
    method: 'POST',
  })
    .then(res => res.json())
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getFollowingSponsorsRewards = ({ userName, skip }) => {
  const query = skip ? `/?skip=${skip}` : '';

  fetch(`${config.campaignApiPrefix}${config.rewards}/${userName}${query}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const showMoreTagsForFilters = (category, objectTypeName, skip = 0, limit = 10) =>
  fetch(
    `${config.apiPrefix}${config.objectType}${config.showMoreTags}?skip=${skip}&limit=${limit}&tagCategory=${category}&objectType=${objectTypeName}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const showMoreTagsForUserFilters = (
  userName,
  schema,
  path,
  tagCategory,
  skip = 0,
  limit = 10,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.user}${config.filters}${config.tags}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      userName,
      schema,
      tagCategory,
      skip,
      limit,
      path,
    }),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const showMoreTagsForShopFilters = (tagCategory, path, skip = 0, limit = 10) =>
  fetch(`${config.apiPrefix}${config.shop}${config.filters}${config.tags}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      path,
      tagCategory,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getSocialInfoPost = (author, postPermlink) =>
  fetch(
    `${config.apiPrefix}${config.post}${config.social}?author=${author}&permlink=${postPermlink}`,
    {
      headers: {
        ...headers,
        app: config.appName,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const waivioAPI = {
  getAuthenticatedUserMetadata,
  broadcastGuestOperation,
  getUserAccount,
};

export const getTransferHistory = (username, limit = 10, operationNum = -1) =>
  fetch(
    `${config.campaignApiPrefix}${config.payments}${config.transfers_history}?userName=${username}&limit=${limit}&operationNum=${operationNum}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getTransferHistoryTableView = (data, filterAcc) => {
  const typesQuery = TRANSACTION_TYPES.reduce((acc, curr) => `${acc}&types=${curr}`, '');
  const filterAccounts =
    filterAcc && filterAcc.reduce((acc, curr) => `${acc}&filterAccounts=${curr}`, '');
  const query = createQuery(data);

  return fetch(
    `${config.campaignApiPrefix}${config.payments}${config.transfers_history}?${query}&${typesQuery}&tableView=true&limit=15&${filterAccounts}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const sendSentryNotification = async () => {
  try {
    if (!['staging', 'production'].includes(process.env.NODE_ENV)) return;
    await fetch(`${config.telegramApiPrefix}${config.setSentryNotify}?app=${config.sentryAppName}`);
  } catch (error) {
    return { error };
  }
};

export const getReferralDetails = () =>
  fetch(`${config.campaignApiPrefix}${config.referrals}/details?appName=${config.appName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUserIsBlackListed = username =>
  fetch(
    `${config.campaignApiPrefix}${config.referrals}/check-user-app-blacklist?userName=${username}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUserStatusCards = (username, sort = 'recency', skip = 0, limit = 10) =>
  fetch(
    `${config.campaignApiPrefix}${config.referrals}/status?userName=${username}&skip=${skip}&limit=${limit}&sort=${sort}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getStatusSponsoredRewards = (referral, userName, type = 'referral_server_fee') =>
  fetch(`${config.campaignApiPrefix}${config.payments}${config.payables}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ referral, userName, type }),
  })
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getRelatedPhotos = (authorPermlink, limit, skip, host) =>
  fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.related}?limit=${limit}&skip=${skip}`,
    {
      headers: {
        ...headers,
        ...addAppHost(host),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(result => result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

// websites

export const getDomainList = () =>
  fetch(`${config.apiPrefix}${config.sites}${config.getParents}`, {
    method: 'GET',
    headers,
  })
    .then(r => r.json())
    .catch(err => err);

export const createWebsite = async body => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}${config.create}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    body: JSON.stringify(body),
    method: 'PUT',
  }).then(res => res.json());
};

export const checkAvailable = (name, parent, isHost) =>
  fetch(
    `${config.apiPrefix}${config.sites}${config.checkAvailable}?${
      isHost ? 'host' : 'name'
    }=${name}&parentId=${parent}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res)
    .catch(e => e);

export const checkkNs = host =>
  fetch(`${config.apiPrefix}${config.sites}${config.checkNs}?host=${host}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getParentHost = host =>
  fetch(`${config.apiPrefix}${config.sites}${config.parentHost}?host=${host}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res.result)
    .catch(e => e);

export const getInfoForManagePage = async name => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}${config.managePage}?userName=${name}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'GET',
  })
    .then(res => res)
    .catch(e => e);
};

export const deleteSite = async (userName, host) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    body: JSON.stringify({ userName, host }),
    method: 'DELETE',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getWebsitesReports = async formData => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();
  const queryString = Object.keys(formData).reduce(
    (acc, value) => (acc ? `${acc}&${value}=${formData[value]}` : `${value}=${formData[value]}`),
    '',
  );

  return fetch(`${config.apiPrefix}${config.sites}${config.report}?${queryString}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getWebsites = async userName => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}?userName=${userName}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getWebsitesConfiguration = async host => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}${config.configuration}?host=${host}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const saveWebsitesConfiguration = async body => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}${config.configuration}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    body: JSON.stringify({ ...body }),
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getWebsiteAdministrators = async (host, userName) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.apiPrefix}${config.sites}${config.administrators}?host=${host}&userName=${userName}`,
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
    .then(res => res)
    .catch(e => e);
};

export const getWebsiteModerators = async (host, userName) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.apiPrefix}${config.sites}${config.moderators}?host=${host}&userName=${userName}`,
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
    .then(res => res)
    .catch(e => e);
};
export const getWebsiteAuthorities = async (host, userName) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.apiPrefix}${config.sites}${config.authorities}?host=${host}&userName=${userName}`,
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
    .then(res => res)
    .catch(e => e);
};

export const getTagCategoryForSite = async (host, userName) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.apiPrefix}${config.sites}${config.filters}?host=${host}&userName=${userName}`,
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
    .then(res => res)
    .catch(e => e);
};

export const saveTagCategoryForSite = async (host, userName, objectsFilter) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.sites}${config.filters}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      host,
      userName,
      objectsFilter,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getSettingsWebsite = host =>
  fetch(`${config.apiPrefix}${config.sites}${config.settings}?host=${host}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getSettingsAdsense = host =>
  fetch(`${config.apiPrefix}${config.sites}${config.adSense}?host=${host}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getSiteStatusInfo = host =>
  fetch(`${config.apiPrefix}${config.sites}${config.info}?host=${host}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getCurrentAppSettings = () =>
  fetch(`${config.apiPrefix}${config.sites}`, {
    headers,
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getObjectTypeFilters = (objectType, wobjectLinks) =>
  fetch(`${config.apiPrefix}${config.objectTypes}${config.tagForFilter}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      objectType,
      wobjectLinks,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getWaivMetric = () =>
  fetch(`${config.apiPrefix}/waiv${config.metrics}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const setWebsiteObjCoordinates = (params = {}) =>
  fetch(`${config.apiPrefix}${config.sites}/map`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'PUT',
    body: JSON.stringify(params),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getWebsiteObjCoordinates = host =>
  fetch(`${config.apiPrefix}${config.sites}${config.map}?host=${host}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getRestrictionsInfo = async (host, userName) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(
    `${config.apiPrefix}${config.sites}${config.restrictions}?host=${host}&userName=${userName}`,
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
    .then(res => res)
    .catch(e => e);
};

export const getWebsiteObjectsWithCoordinates = (params = {}, accessToken) =>
  fetch(`${config.apiPrefix}${config.sites}${config.map}`, {
    headers: { ...headers, 'access-token': accessToken },
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getExpertiseCounters = userName =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.expertiseCounters}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getReservedCounter = userName =>
  fetch(`${config.campaignV2ApiPrefix}${config.reservation_v2}${config.count}/${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getUserCoordinatesByIpAdress = () =>
  fetch(`${config.apiPrefix}${config.geoIp}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const putUserCoordinates = params =>
  fetch(`${config.apiPrefix}${config.geoIp}`, {
    headers,
    body: JSON.stringify(params),
    method: 'PUT',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const checkExpiredPayment = userName =>
  fetch(
    `${config.campaignApiPrefix}${config.payments}${config.payableWarning}?userName=${userName}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getVipTicketsInfo = (queryData, isGuest) => {
  const queryString = createQuery(queryData);

  return fetch(`${config.apiPrefix}${config.vipTickets}?${queryString}`, {
    headers: {
      ...headers,
      'access-token': isGuest ? getGuestAccessToken() : Cookie.get('access_token'),
      ...(isGuest ? { 'waivio-auth': true } : {}),
      'hive-auth': Boolean(Cookie.get('auth')),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const addNoteInVipTicket = (body, isGuest) =>
  fetch(`${config.apiPrefix}${config.vipTickets}`, {
    headers: {
      ...headers,
      'access-token': isGuest ? getGuestAccessToken() : Cookie.get('access_token'),
      ...(isGuest ? { 'waivio-auth': true } : { 'hive-auth': Boolean(Cookie.get('auth')) }),
    },
    body: JSON.stringify(body),
    method: 'PATCH',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getAdvancedReports = (body, user = '') => {
  const actualHeaders = user ? { ...headers, user } : { ...headers };

  return fetch(`${config.campaignApiPrefix}${config.payments}${config.advancedReport}`, {
    headers: actualHeaders,
    body: JSON.stringify({ ...body, user }),
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getWaivAdvancedReports = (body, user = '', abortController) => {
  const actualHeaders = user ? { ...headers, user } : { ...headers };

  return fetch(`${config.apiPrefix}${config.user}${config.advancedReport}`, {
    headers: actualHeaders,
    body: JSON.stringify({ ...body, user }),
    ...(abortController && { signal: abortController.signal }),
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};
export const getReportsDetails = (reportId, skip, limit = 500) =>
  fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.report}`,
    {
      headers,
      body: JSON.stringify({
        reportId,
        skip,
        limit,
      }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const generateAdvancedReports = (body, user = '', abortController) => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(`${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}`, {
    headers: actualHeaders,
    body: JSON.stringify(body),
    ...(abortController && { signal: abortController.signal }),
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};
export const excludeInReportsDetails = (reportId, _id, user) => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.record}`,
    {
      headers: actualHeaders,
      body: JSON.stringify({
        reportId,
        _id,
        user,
      }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getInProgressGenerateAdvancedReports = (user = '') => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.progress}`,
    {
      headers: actualHeaders,
      body: JSON.stringify({ user }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getHistoryGenerateAdvancedReports = (user = '') => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.history}`,
    {
      headers: actualHeaders,
      body: JSON.stringify({ user }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const stopGenerateReport = (user = '', reportId) => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.stop}`,
    {
      headers: actualHeaders,
      body: JSON.stringify({ user, reportId }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};
export const pauseGenerateReport = (user = '', reportId) => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.pause}`,
    {
      headers: actualHeaders,
      body: JSON.stringify({ user, reportId }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};
export const resumeGenerateReport = (user = '', reportId) => {
  const actualHeaders = user ? { ...headers, ...getAuthHeaders(), user } : { ...headers };

  return fetch(
    `${config.apiPrefix}${config.user}${config.advancedReport}${config.generated}${config.resume}`,
    {
      headers: actualHeaders,
      body: JSON.stringify({ user, reportId }),
      method: 'POST',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const accountsCreationDate = userName =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.creationDate}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const calculateVoteValueForSlider = (userName, query) => {
  const queryString = createQuery(query);

  return fetch(`${config.apiPrefix}${config.user}/${userName}${config.voteValue}?${queryString}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const excludeAdvancedReports = (body, isGuest) =>
  fetch(`${config.campaignApiPrefix}${config.payments}${config.exemptions}`, {
    headers: {
      ...headers,
      'access-token': isGuest ? getGuestAccessToken() : Cookie.get('access_token'),
      ...(isGuest ? { 'waivio-auth': true } : { 'hive-auth': Boolean(Cookie.get('auth')) }),
    },
    body: JSON.stringify(body),
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getCurrentCurrencyRate = currency =>
  fetch(
    `${config.currenciesApiPrefix}${config.rate}${config.latest}?base=USD&symbols=${currency}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getNearbyObjects = (authorPermlink, host, skip = 0, limit = 5, radius = 20000) => {
  const queryString = `?skip=${skip}&limit=${limit}&radius=${radius}`;

  return fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.nearby}${queryString}`,
    {
      headers: {
        ...headers,
        Origin: host,
      },
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json());
};

export const getRewardFund = () =>
  fetch(`${config.apiPrefix}${config.hive}${config.rewardFund}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getCurrentMedianHistory = () =>
  fetch(`${config.apiPrefix}${config.hive}${config.currentMedianHistory}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getMatchBots = (botName, botType, skip, limit) => {
  const queryString = `?botName=${botName}&skip=${skip}&limit=${limit}`;

  return fetch(`${config.campaignApiPrefix}${config.getMatchBots}/${botType}${queryString}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json());
};

export const getDistrictsWithCount = () =>
  fetch(
    `${config.apiPrefix}${config.getObjects}${config.count}${config.area}?objectType=restaurant`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getTypesPrefetch = types => {
  const type = types.length > 1 ? types.join(',') : types.toString();

  return fetch(`${config.apiPrefix}${config.sites}${config.prefetch}?types=${type}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);
};

export const getMapExperts = (userName, params) =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.map}${config.experts}`, {
    headers: {
      ...headers,
      follower: userName,
      following: userName,
    },
    body: JSON.stringify(params),
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getPostsForMap = params =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.map}${config.lastPost}`, {
    headers,
    body: JSON.stringify(params),
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getHiveFeedHistory = () =>
  fetch('https://api.hive.blog/', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'condenser_api.get_feed_history',
      params: [],
    }),
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(e => e);

export const getDelegatedRc = user =>
  fetch('https://api.hive.blog/', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 10,
      jsonrpc: '2.0',
      method: 'rc_api.list_rc_direct_delegations',
      params: {
        start: [user, ''],
        limit: 1000,
      },
    }),
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(e => e);

export const getRcByAccount = user =>
  fetch('https://api.hive.blog/', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 8,
      jsonrpc: '2.0',
      method: 'rc_api.find_rc_accounts',
      params: { accounts: [user, ''] },
    }),
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(e => e);

export const getIncomingRcDelegations = delegatee =>
  fetch(
    `${config.apiPrefix}${config.users}${config.rcDelegations}${config.incoming}?delegatee=${delegatee}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHiveConversion = user =>
  fetch('https://api.hive.blog/', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 2,
      jsonrpc: '2.0',
      method: 'condenser_api.get_collateralized_conversion_requests',
      params: [user],
    }),
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(e => e);

export const getHbdConversion = user =>
  fetch('https://api.hive.blog/', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 2,
      jsonrpc: '2.0',
      method: 'condenser_api.get_conversion_requests',
      params: [user],
    }),
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(e => e);

const hiveEngineContract = async params =>
  engineProxy(params).then(response => {
    if (response?.error) {
      return Promise.reject(response?.error);
    }

    return response;
  });

export const getMarketPools = async ({ query }) =>
  engineProxy({
    contract: 'marketpools',
    table: 'pools',
    query,
  });

export const getTokenBalance = (userName, symbol) =>
  hiveEngineContract({
    contract: 'tokens',
    table: 'balances',
    query: {
      account: userName,
      symbol,
    },
    limit: 1000,
    offset: 0,
    indexes: '',
  });

export const getWithdraws = () =>
  hiveEngineContract({
    contract: 'hivepegged',
    table: 'withdrawals',
    query: {},
    // limit: 1000,
    // offset: 0,
    // indexes: '',
  });

export const getTokensEngineRates = currency =>
  fetch(`${config.currenciesApiPrefix}${config.engineRates}?base=${currency}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getTokensEngineChart = (currency, period) =>
  fetch(`${config.currenciesApiPrefix}${config.engineChart}?base=${currency}&period=${period}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getUserVoteValueInfo = (userName, host) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.voteValueInfo}`, {
    headers: {
      ...headers,
      ...addAppHost(host),
    },
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getWaivSwapTokensHistory = (skip, limit) =>
  fetch(`${config.apiPrefix}/waiv${config.swapHistory}?skip=${skip}&limit=${limit}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getUserVoteValueInWaiv = (userName, weight) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}/waiv-vote?weight=${weight}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response.result)
    .catch(e => e);

export const checkUserInObjWhiteList = userName =>
  fetch(`${config.apiPrefix}${config.user}/${userName}/white-list-object`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getEngineTransactionHistory = body =>
  fetch(`${config.campaignApiPrefix}${config.hiveEngine}${config.accountHistory}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const likePost = body => {
  const guestToken = getGuestAccessToken();

  return (
    fetch(`${config.apiPrefix}${config.post}${config.likePost}`, {
      headers: {
        ...headers,
        'access-token': guestToken || Cookie.get('access_token'),
        'waivio-auth': Boolean(guestToken),
        'hive-auth': Boolean(Cookie.get('auth')),
      },
      method: 'POST',
      body: JSON.stringify(body),
    })
      // .then(handleErrors)
      .then(res => res.json())
      .then(response => response)
      .catch(e => e)
  );
};

export const voteUpdatesPost = (wobj, body) => {
  const guestToken = getGuestAccessToken();

  return (
    fetch(`${config.apiPrefix}${config.getObjects}/${wobj}${config.voteField}`, {
      headers: {
        ...headers,
        'access-token': guestToken || Cookie.get('access_token'),
        'waivio-auth': Boolean(guestToken),
        'hive-auth': Boolean(Cookie.get('auth')),
      },
      method: 'POST',
      body: JSON.stringify(body),
    })
      // .then(handleErrors)
      .then(res => res.json())
      .then(response => response)
      .catch(e => e)
  );
};

export const getHiveDelegate = username =>
  fetch(`${config.apiPrefix}${config.user}/${username}${config.delegation}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getTokensTransferList = (symbol, account, offset = 0, limit = 10) =>
  fetch(
    `https://accounts.hive-engine.com/accountHistory?account=${account}&limit=${limit}&offset=${offset}${
      symbol ? `&symbol=${symbol}` : ''
    }`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getWaivVoteMana = async account => {
  const mana = await hiveEngineContract({
    contract: 'comments',
    table: 'votingPower',
    query: { rewardPoolId: WAIVIdPool, account },
  });

  return mana?.[0];
};

export const getTokensRate = symbols =>
  hiveEngineContract({
    contract: 'market',
    indexes: '',
    limit: 1000,
    offset: 0,
    query: { symbol: { $in: symbols } },
    table: 'metrics',
  });

export const getHiveBookList = account =>
  fetch('https://api.hive.blog/', {
    method: 'POST',
    body: JSON.stringify({
      id: 6,
      jsonrpc: '2.0',
      method: 'condenser_api.get_open_orders',
      params: [account],
    }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response.result)
    .catch(e => e);

export const getSellBookList = (account, offset) =>
  hiveEngineContract({
    contract: 'market',
    query: { account, symbol: 'WAIV' },
    indexes: [
      {
        index: 'priceDec',
        descending: false,
      },
    ],
    limit: 5,
    offset,
    table: 'sellBook',
  });

export const getBuyBookList = (account, offset) =>
  hiveEngineContract({
    contract: 'market',
    query: { account, symbol: 'WAIV' },
    indexes: [
      {
        index: 'priceDec',
        descending: true,
      },
    ],
    limit: 5,
    offset,
    table: 'buyBook',
  });

export const getFeeInfo = () =>
  engineProxy({
    contract: 'marketpools',
    table: 'params',
    query: {},
  });

export const getDelegateList = data =>
  engineProxy({
    contract: 'tokens',
    table: 'delegations',
    query: {
      ...data,
    },
  });

export const getTokensInformation = symbols =>
  hiveEngineContract({
    contract: 'tokens',
    table: 'tokens',
    indexes: '',
    limit: 1000,
    offset: 0,
    query: { symbol: { $in: symbols } },
  });

export const getPendingUndelegationsToken = (account, symbol = 'WAIV') =>
  hiveEngineContract({
    contract: 'tokens',
    table: 'pendingUndelegations',
    query: {
      account,
      symbol,
    },
  });

export const getPendingUnstakesToken = (account, symbol = 'WAIV') =>
  hiveEngineContract({
    contract: 'tokens',
    table: 'pendingUnstakes',
    query: {
      account,
      symbol,
    },
  });

export const getHiveEngineSwap = () =>
  fetch(`${config.campaignApiPrefix}${config.hiveEngine}${config.swap}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getDepositWithdrawPair = () =>
  fetch(`${config.currenciesApiPrefix}${config.withdraw}${config.pairs}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHiveEngineCoins = () =>
  fetch(`${config.currenciesApiPrefix}${config.withdraw}${config.coins}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const converHiveEngineCoins = data =>
  fetch('https://converter-api.hive-engine.com/api/convert/', {
    headers,
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const checkExistPermlink = permlink =>
  fetch(`${config.apiPrefix}${config.getObjects}/${permlink}${config.exist}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getUpdatesList = (permlink, skip = 0, query) => {
  const compareQuery = createQuery(query);

  return fetch(
    `${config.apiPrefix}${config.getObjects}/${permlink}${config.fields}?skip=${skip}&${compareQuery}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

// new campaings

export const createNewCampaing = (data, account) =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaign}`, {
    headers: {
      ...headers,
      account,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getRewardsFollowerUser = (skip = 0, query, sort, userName) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.user}?sort=${sort}&userName=${userName}&skip=${skip}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const updateCampaing = (data, account) =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaign}`, {
    headers: {
      ...headers,
      account,
      ...getAuthHeaders(),
    },
    method: 'PATCH',
    body: JSON.stringify(data),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getCampaingManageList = giudeName =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaigns}${config.manager}/${giudeName}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getCampaingBalanceList = giudeName =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaigns}${config.balance}/${giudeName}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getCampaingHistoryList = (giudeName, skip = 0) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.campaigns}${config.history}/${giudeName}?limit=10&skip=${skip}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getAllRewardList = (skip = 0, query, sort, reach) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.all}?limit=10&skip=${skip}&reach=${reach}&sort=${sort}&${query}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getMessagesList = (userName, skip, query, sort) => {
  const filters = parseQuery(query);

  return fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.messages}${config.guide}/${userName}`,
    {
      headers,
      method: 'POST',
      body: JSON.stringify({
        limit: 10,
        skip,
        sort,
        caseStatus: filters?.conversations?.[0],
        reservationPermlink: filters?.reservationPermlink?.[0],
        statuses: filters?.statuses,
      }),
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getFraudDetectionList = (userName, skip, query, sort) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.frauds}/${userName}?limit=10&skip=${skip}`,
    {
      headers,
      method: 'POST',
      body: JSON.stringify({
        limit: 10,
        skip,
        sort,
        ...parseQuery(query),
      }),
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getReservedRewardList = (userName, skip = 0) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.reserved}/${userName}?limit=10&skip=${skip}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getEligibleRewardList = (userName, skip = 0, query, sort, reach) => {
  const user = userName ? `&userName=${userName}` : '';

  return fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.eligible}?&limit=10&skip=${skip}&sort=${sort}&reach=${reach}&${query}${user}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getPropositionByCampaingObjectPermlink = (
  parentPermlink,
  userName,
  skip = 0,
  query,
  sort = 'payout',
  reach,
) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${
      config.all
    }/object/${parentPermlink}?limit=10&skip=${skip}&sort=${sort}&reach=${reach}${
      userName ? `&userName=${userName}` : ''
    }${query}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getReservedProposition = (userName, skip = 0, query, sort) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.reserved}/${userName}?limit=10&skip=${skip}${query}&sort=${sort}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getReservationsList = (guideName, skip = 0, query, sort) =>
  fetch(`${config.campaignV2ApiPrefix}${config.rewards}${config.reservations}/${guideName}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      limit: 10,
      skip,
      sort,
      ...parseQuery(query),
    }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getHistoryList = (guideName, skip = 0, query, sort) => {
  const filters = parseQuery(query);

  return fetch(`${config.campaignV2ApiPrefix}${config.rewards}${config.history}/${guideName}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      limit: 10,
      skip,
      sort,
      ...filters,
      reservationPermlink: filters?.reservationPermlink?.[0],
    }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};

export const getRewardTab = userName =>
  fetch(`${config.campaignV2ApiPrefix}${config.rewards}${config.tabType}/${userName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getEligiblePropositionByCampaingObjectPermlink = (
  parentPermlink,
  userName,
  skip = 0,
  query,
  sort,
  reach,
) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${
      config.eligible
    }/object/${parentPermlink}?limit=10&skip=${skip}${
      userName ? `&userName=${userName}` : ''
    }${query}&sort=${sort}&reach=${reach}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getEligiblePropositionByCampaingUser = (
  parentPermlink,
  userName,
  skip = 0,
  query,
  sort,
  reach,
) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}/user/${parentPermlink}?limit=10&skip=${skip}${
      userName ? `&userName=${userName}` : ''
    }${query}&sort=${sort}&reach=${reach}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const validateActivateCampaing = data =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaign}${config.activate}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const validateEgibilitiesForUser = data =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.availability}?${createQuery(data)}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const validateDeactivateCampaing = data =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaign}${config.deactivate}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getNewCampaingById = id =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaign}/${id}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
// {guideName, payoutToken, days, payable}
export const getPaybelsList = (guideName, data = {}) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.payables}${config.guide}/${guideName}?${createQuery(
      data,
    )}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
export const getReceivablesList = (user, data = {}) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.payables}${config.user}/${user}?${createQuery(data)}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getPaybelsListByUser = (guideName, userName) =>
  fetch(`${config.campaignV2ApiPrefix}${config.payables}${config.guide}/${guideName}/${userName}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

// userName*, guideName*, reviewPermlink*, payoutToken
export const getReportByUser = data =>
  fetch(`${config.campaignV2ApiPrefix}${config.payables}${config.report}?${createQuery(data)}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForAllRewards = reach =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.all}${config.sponsors}?reach=${reach}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForEligibleRewards = (userName, reach) => {
  const user = userName ? `&userName=${userName}` : '';

  return fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.eligible}${config.sponsors}?reach=${reach}${user}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
};
export const getFiltersForMessages = () =>
  fetch(`${config.campaignV2ApiPrefix}${config.rewards}${config.messages}${config.filters}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForEligibleProposition = (reqObj, userName, reach) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.eligible}${config.sponsors}${config.object}/${reqObj}?userName=${userName}&reach=${reach}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForAllProposition = (reqObj, name, reach) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.all}${config.sponsors}${config.object}/${reqObj}?reach=${reach}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForReservedProposition = (reqObj, userName) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.reserved}/${userName}${config.filters}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForReservationsProposition = (reqObj, userName) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.reservations}/${userName}${config.filters}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getFiltersForHistoryProposition = userName =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.history}/${userName}${config.filters}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getSponsorsMatchBots = (botName, limit, skip) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.bots}${config.sponsors}?botName=${botName}&skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getMentionCampaign = (user, id, secondary) =>
  fetch(`${config.campaignV2ApiPrefix}${config.campaign}${config.details}/${id}/${secondary}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getUsersMentionCampaign = user =>
  fetch(`${config.campaignV2ApiPrefix}${config.rewards}/user/${user}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getCampaign = (user, id) =>
  fetch(`${config.campaignV2ApiPrefix}${config.reservation_v2}${config.details}/${user}/${id}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => ({ ...response, type: campaignTypes.REVIEWS }))
    .catch(e => e);

// avarage

export const getRebalancingTable = (account, params) => {
  const query = createQuery(params);

  return fetch(`${config.arbitrageApiPrefix}${config.rebalancing}/${account}?${query}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(async response => {
      const tokensList = response.table.reduce((acc, tab) => [...acc, tab.base, tab.quote], []);
      const balances = await getTokenBalance(account, { $in: tokensList });
      const table = response.table.reduce((acc, curr) => {
        const { balance } = balances.find(bal => bal.symbol === curr.base) || { balance: 0 };
        const { balance: quoteBalance } = balances.find(bal => bal.symbol === curr.quote) || {
          balance: 0,
        };

        return [...acc, { ...curr, balance, quoteBalance, symbol: curr.base }];
      }, []);

      return {
        table,
        differencePercent: response.differencePercent,
      };
    })
    .catch(e => e);
};

export const getProfitTable = account =>
  fetch(`${config.arbitrageApiPrefix}${config.profit}${config.report}/${account}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const addTokenReport = (account, data) =>
  fetch(`${config.arbitrageApiPrefix}${config.profit}${config.report}/${account}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify(data),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const editTokenProfit = (account, data) =>
  fetch(`${config.arbitrageApiPrefix}${config.profit}${config.report}/${account}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'PATCH',
    body: JSON.stringify(data),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const deleteTokenProfit = (account, data) =>
  fetch(`${config.arbitrageApiPrefix}${config.profit}${config.report}/${account}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'DELETE',
    body: JSON.stringify(data),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const setRebalancingTableItem = (account, body) =>
  fetch(`${config.arbitrageApiPrefix}${config.rebalancing}/${account}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'PATCH',
    body: JSON.stringify(body),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getSwapInfoForRebalance = (account, pair) =>
  fetch(`${config.arbitrageApiPrefix}${config.rebalancing}/${account}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      pair,
    }),
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getEnginePoolRate = tokens =>
  fetch(`${config.currenciesApiPrefix}${config.enginePoolsRate}?symbols=${tokens.join(',')}`, {
    headers,
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getBlackListInfo = user =>
  fetch(`${config.campaignV2ApiPrefix}${config.blacklists}/${user}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getObjectsRewards = (requiredObj, userName) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.object}/${requiredObj}${
      userName ? `?userName=${userName}` : ''
    }`,
    {
      headers: { ...headers, follower: userName },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getGlobalReports = body =>
  fetch(`${config.campaignV2ApiPrefix}${config.payables}${config.report}${config.global}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const checkPayblesWarning = guideName =>
  fetch(`${config.campaignV2ApiPrefix}${config.payables}${config.warning}/${guideName}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const checkUserInBlackList = (guideName, userName) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.blacklist}/${guideName}/${userName}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const checkUserFollowing = (userName, users, objects) =>
  fetch(`${config.campaignV2ApiPrefix}${config.rewards}${config.following}/${userName}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      users,
      objects,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getMarkersForAll = (userName, box, skip, limit = 20, reach) =>
  fetch(`${config.campaignV2ApiPrefix}${config.rewards}${config.all}${config.map}?reach=${reach}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      userName,
      box,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getMarkersForEligible = (userName, box, skip, limit = 20, reach) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.eligible}${config.map}?reach=${reach}`,
    {
      headers,
      method: 'POST',
      body: JSON.stringify({
        userName,
        box,
        skip,
        limit,
      }),
    },
  )
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getCurrencyType = () =>
  fetch(`${config.currenciesApiPrefix}${config.rate}${config.available}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getNestedDepartmentFields = ({ name, names, excluded }) =>
  fetch(`${config.apiPrefix}${config.departments}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      name,
      names,
      excluded,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getObjectsByDepartment = (userName, departments, schema, host, skip, limit) =>
  fetch(`${config.apiPrefix}${config.departments}${config.wobjects}`, {
    headers: {
      ...headers,
      follower: userName,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({
      departments,
      schema,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
export const getObjectsByGroupId = (userName, groupId, skip, limit = 10) =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.groupId}`, {
    headers: {
      ...headers,
      follower: userName,
    },
    method: 'POST',
    body: JSON.stringify({
      groupId,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getUserProfileBlogTags = (userName, { limit = 10, skip }, checkedTags) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.blogTags}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      skip,
      limit,
      checkedTags,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
export const getObjectInfo = (links, locale, host) =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.names}`, {
    headers: { ...headers, locale, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      links,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
export const getNewsPermlinkByObjectName = ({
  name,
  limit = 10,
  userLanguages,
  locale,
  follower,
}) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${name}${config.newsfeed}`, {
    headers: {
      ...headers,
      app: config.appName,
      locale,
      follower,
    },
    method: 'POST',
    body: JSON.stringify({ limit, user_languages: userLanguages }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getObjectOptions = (userName, authorPermlink, category, skip, limit) =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.options}`, {
    headers: {
      ...headers,
      follower: userName,
    },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      category,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);
export const searchDepartments = (searchString, limit, skip) =>
  fetch(`${config.apiPrefix}${config.departments}${config.search}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ searchString, limit, skip }),
  }).then(res => res.json());

export const getAuthorityFields = permlink =>
  fetch(`${config.apiPrefix}${config.getObjects}/${permlink}${config.authorityFields}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getShopUserDepartments = (userName, name, excluded, path, host, schema) =>
  fetch(`${config.apiPrefix}${config.shop}${config.user}${config.departments}`, {
    headers: { ...headers, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      userName,
      name,
      excluded,
      path,
      schema,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getShopDepartments = (name, excluded, path, host) =>
  fetch(`${config.apiPrefix}${config.shop}${config.departments}`, {
    headers: { ...headers, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      name,
      excluded,
      path,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUserShopMainFeed = (
  userName,
  schema,
  follower,
  filter,
  excludedDepartments,
  department,
  skip,
  path,
  limit,
  categoryLimit,
  host,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.user}${config.mainFeed}`, {
    headers: {
      ...headers,
      follower,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      filter,
      excludedDepartments,
      department,
      skip,
      limit,
      path,
      schema,
      categoryLimit,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getShopMainFeed = (
  userName,
  follower,
  filter,
  excludedDepartments,
  department,
  skip,
  path,
  limit = 10,
  categoryLimit,
  host,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.mainFeed}`, {
    headers: {
      ...headers,
      follower: userName,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      filter,
      excludedDepartments,
      department,
      skip,
      limit,
      path,
      categoryLimit,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWobjectShopMainFeed = (
  authorPermlink,
  department,
  follower,
  skip,
  excludedDepartments,
  filter,
  path,
  limit = 10,
  categoryLimit,
  host,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.mainFeed}`, {
    headers: {
      ...headers,
      follower,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      skip,
      excludedDepartments,
      filter,
      limit,
      department,
      path,
      categoryLimit,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWobjectShopDepartments = (authorPermlink, name, excluded, path, host) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.departments}`, {
    headers: {
      ...headers,
      ...addAppHost(host),
    },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      name,
      excluded,
      path,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWobjectShopFilters = (authorPermlink, path) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.filters}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      path,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMoreTagsForWobjectShopFilters = (
  authorPermlink,
  path,
  tagCategory,
  skip = 0,
  limit = 10,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.filters}${config.tags}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      path,
      tagCategory,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getDepartmentsFeed = (
  userName,
  follower,
  department,
  filter,
  path,
  schema,
  skip,
  limit,
  locale,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.user}${config.departmentFeed}`, {
    headers: {
      ...headers,
      locale,
      follower,
    },
    method: 'POST',
    body: JSON.stringify({
      department,
      userName,
      filter,
      skip,
      limit,
      path,
      schema,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWobjectDepartmentsFeed = (
  authorPermlink,
  department,
  follower,
  filter,
  path,
  schema,
  skip,
  limit,
  locale,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.departmentFeed}`, {
    headers: {
      ...headers,
      locale,
      follower,
    },
    method: 'POST',
    body: JSON.stringify({
      department,
      authorPermlink,
      path,
      schema,
      skip,
      limit,
      filter,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getShopDepartmentFeed = (
  userName,
  follower,
  department,
  filter,
  path,
  schema,
  skip,
  limit,
  locale,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.departmentFeed}`, {
    headers: {
      ...headers,
      locale,
      follower,
    },
    method: 'POST',
    body: JSON.stringify({
      department,
      userName,
      filter,
      skip,
      schema,
      limit,
      path,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getDepartmentsFilters = path =>
  fetch(`${config.apiPrefix}${config.shop}${config.filters}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      path,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getDepartmentsUserFilters = (userName, path, schema) =>
  fetch(`${config.apiPrefix}${config.shop}${config.user}${config.filters}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ userName, path, schema }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAffiliateCodesForWebsite = (userName, host) =>
  fetch(`${config.apiPrefix}${config.sites}${config.affiliate}?userName=${userName}&host=${host}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAffiliateObjectForWebsite = (userName, host) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.affiliate}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ host }),
    method: 'POST',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const safeAffiliateCodesForWebsite = (userName, host, links) =>
  fetch(`${config.apiPrefix}${config.sites}${config.affiliate}`, {
    headers: {
      ...headers,
      ...getAuthHeaders(),
    },
    method: 'PUT',
    body: JSON.stringify({
      userName,
      host,
      links,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getReferenceObjectsList = ({ authorPermlink, userName, locale }) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.reference}`, {
    headers: { ...headers, follower: userName, locale },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getReferenceObjectsListByType = ({
  authorPermlink,
  type,
  skip,
  limit = 15,
  userName,
  locale,
}) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.reference}${config.type}`, {
    headers: { ...headers, follower: userName, locale },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      referenceObjectType: type,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getRelatedObjectsFromDepartments = (
  authorPermlink,
  userName,
  locale,
  skip,
  limit = 30,
  host,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.related}`, {
    headers: { ...headers, follower: userName, locale, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const getAddOnObjectsFromDepartments = (
  authorPermlink,
  userName,
  locale,
  skip,
  limit = 30,
  host,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.addOn}`, {
    headers: { ...headers, follower: userName, locale, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getFeaturedObjects = (authorPermlink, userName, locale, skip = 0, limit = 30, host) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.featured}`, {
    headers: { ...headers, follower: userName, locale, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getSimilarObjectsFromDepartments = (
  authorPermlink,
  userName,
  locale,
  skip,
  limit = 30,
  host,
) =>
  fetch(`${config.apiPrefix}${config.shop}${config.getObjects}${config.similar}`, {
    headers: { ...headers, follower: userName, locale, ...addAppHost(host) },
    method: 'POST',
    body: JSON.stringify({
      authorPermlink,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const sendTiktokPriview = (url, urlPreview) =>
  fetch(`${config.apiPrefix}${config.posts}${config.previewCache}`, {
    headers,
    method: 'PUT',
    body: JSON.stringify({
      url,
      urlPreview,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getVideoPostsPriview = urls => {
  if (isEmpty(urls)) return Promise.resolve([]);

  return fetch(`${config.apiPrefix}${config.posts}${config.previewCache}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      urls,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getChromeExtensionVersion = () =>
  fetch(
    'https://raw.githubusercontent.com/Waiviogit/waivio-import-extension/master/extension/manifest.json',
  )
    .then(response => response.json())
    .then(data => data.version)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMinMaxHiveAmount = outputCoinType =>
  fetch(`${config.apiPrefix}${config.users}${config.guestWallet}${config.hiveWithdrawRange}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      outputCoinType,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getEstimatedHiveAmount = (amount, outputCoinType) =>
  fetch(`${config.apiPrefix}${config.users}${config.guestWallet}${config.hiveWithdrawEstimates}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      amount,
      outputCoinType,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMinRejectVote = (userName, author, permlink, authorPermlink) =>
  fetch(`${config.apiPrefix}${config.users}${config.minReject}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      userName,
      author,
      permlink,
      authorPermlink,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const withdrawHiveForGuest = (amount, outputCoinType, userName, address) => {
  const guestToken = getGuestAccessToken();

  return fetch(`${config.apiPrefix}${config.users}${config.guestWallet}${config.hiveWithdraw}`, {
    headers: {
      ...headers,
      'access-token': guestToken || Cookie.get('access_token'),
      'waivio-auth': Boolean(guestToken),
      'hive-auth': Boolean(Cookie.get('auth')),
    },
    method: 'POST',
    body: JSON.stringify({
      amount,
      outputCoinType,
      userName,
      address,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};
export const withdrawHive = (amount, outputCoinType, userName, address) => {
  const guestToken = getGuestAccessToken();

  return fetch(`${config.apiPrefix}${config.users}${config.hiveWithdraw}`, {
    headers: {
      ...headers,
      'access-token': guestToken || Cookie.get('access_token'),
      'waivio-auth': Boolean(guestToken),
      'hive-auth': Boolean(Cookie.get('auth')),
    },
    method: 'POST',
    body: JSON.stringify({
      amount,
      outputCoinType,
      userName,
      address,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const saveCommentDraft = async (user, author, permlink, body) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.draft}${config.comment}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      author,
      user,
      body,
      permlink,
    }),
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getCommentDraft = async (user, author, permlink) => {
  const query = createQuery({ user, author, permlink });
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.draft}${config.comment}?${query}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};
export const getObjectUpdatesLocale = (authorPermlink, permlink) =>
  fetch(
    `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.listItemLocales}/${permlink}`,
    {
      headers: {
        ...headers,
        ...getAuthHeaders(),
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const getThreadsByHashtag = (follower, permlink, skip = 0, limit = 10, sort = 'latest') =>
  fetch(
    `${config.apiPrefix}${config.thread}${config.hashtag}?hashtag=${permlink}&skip=${skip}&limit=${limit}&sort=${sort}`,
    {
      headers: {
        ...headers,
        follower,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const getThreadsByUser = (follower, userName, skip = 0, limit = 10, sort = 'latest') =>
  fetch(
    `${config.apiPrefix}${config.thread}${config.user}?user=${userName}&skip=${skip}&limit=${limit}&sort=${sort}`,
    {
      headers: {
        ...headers,
        follower,
      },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const getThreadsCountByHashtag = (permlink, skip = 0, limit = 10) =>
  fetch(
    `${config.apiPrefix}${config.thread}${config.hashtag}${config.count}?skip=${skip}&limit=${limit}`,
    {
      headers,
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const getUserFavoritesObjectTypesList = userName =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.favorites}${config.list}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(posts => posts)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUserFavoriteObjects = (authUserName, user, objectType, skip, limit = 10) =>
  fetch(`${config.apiPrefix}${config.user}/${user}${config.favorites}`, {
    headers: { ...headers, follower: authUserName },
    method: 'POST',
    body: JSON.stringify({
      objectType,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getEngineStatisticWaivOwners = () =>
  fetch(`https://engine.waivio.com/engine-statistic/waiv/owners`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getEngineStatisticWaivActiveUsers = () =>
  fetch(`https://engine.waivio.com/engine-statistic/waiv/active-users`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
export const getUserFavoriteObjectsForMap = (authUserName, user, box, limit = 10, skip) =>
  fetch(`${config.apiPrefix}${config.user}/${user}${config.favorites}${config.map}`, {
    headers: { ...headers, follower: authUserName },
    method: 'POST',
    body: JSON.stringify({
      objectTypes: listOfMapObjectTypes,
      box,
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getUsersAvatar = names =>
  fetch(`${config.apiPrefix}${config.users}${config.avatar}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      names,
    }),
  })
    .then(res => res.json())
    .then(r => r)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getGuestUserMana = guestName =>
  fetch(`${config.apiPrefix}${config.user}/${guestName}${config.guestMana}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getObjectsForMapObjectType = (name, body, locale, follower) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${name}${config.map}`, {
    headers: {
      ...headers,
      locale,
      follower,
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(objects => objects)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getMapPermlinkByObject = (authorPermlink, locale, follower, host) =>
  fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.mapLink}`, {
    headers: {
      ...headers,
      locale,
      follower,
      'Access-Host': host,
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(response => response)
    .catch(e => e);

export const getGroupObjectUserList = (authorPermlink, follower, limit, cursor) =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.group}`, {
    headers: {
      ...headers,
      follower,
    },
    method: 'POST',
    body: JSON.stringify({
      limit,
      authorPermlink,
      cursor,
    }),
  })
    .then(res => res.json())
    .then(objects => objects)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getObjectsForMapImportText = async (
  userName,
  latitude,
  longitude,
  includedType,
  textQuery,
) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.placesApi}${config.text}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
      follower: userName,
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      latitude,
      longitude,
      includedType,
      textQuery,
    }),
  })
    .then(res => res.json())
    .then(objects => objects)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getObjectsForMapImportObjects = async (
  userName,
  latitude,
  longitude,
  includedTypes,
) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.placesApi}${config.objects}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
      follower: userName,
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      latitude,
      longitude,
      includedTypes,
    }),
  })
    .then(res => res.json())
    .then(objects => objects)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};
export const getObjectsForMapImportAvatars = async (userName, placesUrl) => {
  let isGuest;
  let token = getGuestAccessToken();

  isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.placesApi}${config.image}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
      follower: userName,
    },
    method: 'POST',
    body: JSON.stringify({
      placesUrl,
      userName,
    }),
  })
    .then(res => res.json())
    .then(objects => objects)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};
export const getObjPermlinkByCompanyId = async (id, idType) => {
  let token = getGuestAccessToken();
  const isGuest = token === 'null' ? false : Boolean(token);

  if (isGuest) token = await getValidTokenData();

  return fetch(`${config.apiPrefix}${config.wobjects}${config.idType}`, {
    headers: {
      ...headers,
      ...(isGuest ? { 'access-token': token.token, 'waivio-auth': true } : { ...getAuthHeaders() }),
    },
    method: 'POST',
    body: JSON.stringify({
      id,
      idType,
    }),
  })
    .then(res => res.json())
    .then(objects => objects)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};

export const getAppAdmins = () =>
  fetch(`${config.apiPrefix}${config.admins}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWebsitesInfoForAdmins = userName =>
  fetch(`${config.apiPrefix}${config.admins}${config.sites}`, {
    headers: { ...headers, admin: userName, ...getAuthHeaders() },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAdminVipTickets = userName =>
  fetch(`${config.apiPrefix}${config.admins}${config.vipTickets}`, {
    headers: { ...headers, admin: userName, ...getAuthHeaders() },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getWhitelistForAdmins = userName =>
  fetch(`${config.apiPrefix}${config.admins}${config.whitelist}`, {
    headers: { ...headers, admin: userName, ...getAuthHeaders() },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res.result)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const addUserToAdminWhitelist = (userName, name) =>
  fetch(`${config.apiPrefix}${config.admins}${config.whitelist}`, {
    headers: {
      ...headers,
      admin: userName,
      ...getAuthHeaders(),
    },
    method: 'PUT',
    body: JSON.stringify({
      name,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const addCreditsByAdmin = (admin, userName, amount) =>
  fetch(`${config.apiPrefix}${config.admins}${config.credits}`, {
    headers: {
      ...headers,
      admin,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      userName,
      amount,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAdminGuests = (admin, skip, limit, searchString) =>
  fetch(`${config.apiPrefix}${config.admins}${config.guests}${config.users}`, {
    headers: {
      ...headers,
      admin,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      skip,
      limit,
      searchString,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAdminSpam = (admin, skip, limit, searchString) =>
  fetch(`${config.apiPrefix}${config.admins}${config.guests}${config.spam}`, {
    headers: {
      ...headers,
      admin,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      skip,
      limit,
      searchString,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getAdminSpamUserDetails = (admin, user, skip = 0, limit = 5) =>
  fetch(`${config.apiPrefix}${config.admins}${config.guests}${config.spam}/${user}`, {
    headers: {
      ...headers,
      admin,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      skip,
      limit,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const blockAdminSpamUser = (admin, name, blocked) =>
  fetch(`${config.apiPrefix}${config.admins}${config.guests}${config.block}`, {
    headers: {
      ...headers,
      admin,
      ...getAuthHeaders(),
    },
    method: 'POST',
    body: JSON.stringify({
      name,
      blocked,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const deleteUserFromAdminWhitelist = (userName, name) =>
  fetch(`${config.apiPrefix}${config.admins}${config.whitelist}`, {
    headers: {
      ...headers,
      admin: userName,
      ...getAuthHeaders(),
    },
    method: 'DELETE',
    body: JSON.stringify({
      name,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getDraftsListAsync = ({ author }) =>
  fetch(`${config.apiPrefix}${config.draft}${config.posts}?author=${author}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const deleteDraftFromList = ({ author, ids }) =>
  fetch(`${config.apiPrefix}${config.draft}${config.post}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'DELETE',
    body: JSON.stringify({
      author,
      ids,
    }),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const saveDraft = body =>
  fetch(`${config.apiPrefix}${config.draft}${config.post}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getPayPalSubscriptionBasic = (host, userName) =>
  fetch(`${config.apiPrefix}${config.sites}${config.paypal}${config.subscription}${config.basic}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'POST',
    body: JSON.stringify({ host, userName }),
  })
    .then(res => res.json())
    .then(res => res.result)
    .catch(e => e);

export const sendPayPalSubscriptionId = (host, userName, subscriptionId) =>
  fetch(
    `${config.apiPrefix}${config.sites}${config.paypal}${config.subscription}${config.paypalActivation}`,
    {
      headers: { ...headers, ...getAuthHeaders() },
      method: 'POST',
      body: JSON.stringify({ host, userName, subscriptionId }),
    },
  )
    .then(res => res.json())
    .then(res => res.result)
    .catch(e => e);

export const getPayPalSubscriptionDetails = (host, userName) =>
  fetch(
    `${config.apiPrefix}${config.sites}${config.paypal}${config.subscription}${config.details}`,
    {
      headers: { ...headers, ...getAuthHeaders() },
      method: 'POST',
      body: JSON.stringify({ host, userName }),
    },
  )
    .then(res => res.json())
    .then(res => res.result)
    .catch(e => e);

export const cancelPayPalSubscription = (host, userName) =>
  fetch(
    `${config.apiPrefix}${config.sites}${config.paypal}${config.subscription}${config.cancel}`,
    {
      headers: { ...headers, ...getAuthHeaders() },
      method: 'POST',
      body: JSON.stringify({ host, userName, reason: 'User requested cancellation' }),
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const websiteStatisticsAction = () =>
  fetch(`${config.apiPrefix}${config.sites}${config.statistics}${config.buyActions}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'POST',
    body: JSON.stringify({}),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const websiteStatisticsReport = formData =>
  fetch(`${config.apiPrefix}${config.sites}${config.statistics}${config.report}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'POST',
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const adminWebsiteStatisticsReport = (admin, formData) =>
  fetch(`${config.apiPrefix}${config.admins}${config.statistics}${config.report}`, {
    headers: { ...headers, ...getAuthHeaders(), admin },
    method: 'POST',
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getCreditsByAdminList = (admin, skip, limit = 50) =>
  fetch(
    `${config.apiPrefix}${config.admins}${config.sites}${config.credits}?skip=${skip}&limit=${limit}`,
    {
      headers: { ...headers, admin, ...getAuthHeaders() },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getSubscriptionsByAdminList = admin =>
  fetch(`${config.apiPrefix}${config.admins}${config.sites}${config.subscriptions}`, {
    headers: { ...headers, admin, ...getAuthHeaders() },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const getCommentReactions = (author, permlink) =>
  fetch('https://api.deathwing.me', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 16,
      jsonrpc: '2.0',
      method: 'condenser_api.get_active_votes',
      params: [author, permlink],
    }),
  })
    .then(res => res.json())
    .then(r => r.result)
    .catch(e => e);

export const getAllActiveSites = () =>
  fetch(`${config.apiPrefix}${config.sites}${config.active}${config.list}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .catch(e => e);

// active campaign
export const getActiveCampaignsFromApi = (body, follower) =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.activeCampaigns}`, {
    headers: {
      ...headers,
      ...(follower ? { follower } : {}),
    },
    method: 'POST',
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .catch(e => e); // active campaign

export const getActiveCampaignsTypesFromApi = (body, follower) =>
  fetch(`${config.apiPrefix}${config.sites}${config.challenges}${config.objectTypes1}`, {
    headers: {
      ...headers,
      ...(follower ? { follower } : {}),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .catch(e => e); // active campaign

export const getInstacartLink = authorPermlink =>
  fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.instacartLink}`, {
    headers: {
      ...headers,
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res.result)
    .catch(e => e);
export const getTrustedUsersList = (host, owner) =>
  fetch(`${config.apiPrefix}${config.sites}${config.trusted}`, {
    headers: { ...headers, ...getAuthHeaders() },
    method: 'POST',
    body: JSON.stringify({ host, owner }),
  })
    .then(res => res.json())
    .catch(e => e);

export const checkLinkSafety = url =>
  fetch(`${config.apiPrefix}${config.wobjects}${config.link}${config.safety}`, {
    headers: {
      ...headers,
    },
    body: JSON.stringify({ url }),
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getSafeLinks = () =>
  fetch(`${config.apiPrefix}${config.safeLinks}`, {
    headers: {
      ...headers,
    },
    method: 'GET',
  })
    .then(handleErrors)
    .then(res => res.json())
    .then(r => r)
    .catch(e => e);

export const getJudgeRewardsMain = (userName, skip, query) => {
  console.log(query);
  const queryParams = query ? `&${query}` : '';

  return fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.judge}/${userName}?skip=${skip}${queryParams}`,
    {
      headers: { ...headers, follower: userName },
      method: 'GET',
    },
  )
    .then(handleErrors)
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};

export const getJudgeRewardsByObject = (requiredObject, userName, skip) =>
  fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.judge}/${userName}${config.object}/${requiredObject}?skip=${skip}`,
    {
      headers: { ...headers, follower: userName },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);

export const getJudgeRewardsFiltersBySponsor = (userName, requiredObject) => {
  const obj = requiredObject ? `?requiredObject=${requiredObject}` : '';

  return fetch(
    `${config.campaignV2ApiPrefix}${config.rewards}${config.judge}/${userName}${config.sponsors}${obj}`,
    {
      headers: { ...headers, follower: userName },
      method: 'GET',
    },
  )
    .then(res => res.json())
    .then(res => res)
    .catch(e => e);
};
export const getJudgesPosts = (judgeName, authorPermlink, activationPermlink, skip, limit = 10) =>
  fetch(`${config.apiPrefix}${config.posts}${config.judgePosts}`, {
    headers: {
      ...headers,
      follower: judgeName,
    },
    body: JSON.stringify({ judgeName, authorPermlink, skip, activationPermlink, limit }),
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getJudgesPostLinks = (
  judgeName,
  authorPermlink,
  activationPermlink,
  skip,
  limit = 50,
) =>
  fetch(`${config.apiPrefix}${config.posts}${config.judgePosts}${config.links}`, {
    headers: { ...headers, follower: judgeName },
    body: JSON.stringify({ judgeName, authorPermlink, activationPermlink, skip, limit }),
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const createAssistantFaq = (currentUser, question, answer, topic) =>
  fetch(`${config.baseUrl}${config.assistant}${config.qna}`, {
    headers: { ...headers, ...getAuthHeaders(), 'Current-User': currentUser },
    body: JSON.stringify({ question, answer, topic }),
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const updateAssistantFaq = currentUser =>
  fetch(`${config.baseUrl}${config.assistant}${config.qna}${config.migrateToWeaviate}`, {
    headers: { ...headers, ...getAuthHeaders(), 'Current-User': currentUser },
    body: '',
    method: 'POST',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const patchAssistantFaq = (currentUser, id, question, answer, topic) =>
  fetch(`${config.baseUrl}${config.assistant}${config.qna}/${id}`, {
    headers: { ...headers, ...getAuthHeaders(), 'Current-User': currentUser },
    body: JSON.stringify({ question, answer, topic }),
    method: 'PATCH',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);
export const deleteAssistantFaq = (currentUser, id) =>
  fetch(`${config.baseUrl}${config.assistant}${config.qna}/${id}`, {
    headers: { ...headers, ...getAuthHeaders(), 'Current-User': currentUser },

    method: 'DELETE',
  })
    .then(handleErrors)
    .then(res => res.json())
    .catch(e => e);

export const getAssistantFaq = (currentUser, topic, skip = 0, limit = 5) => {
  const queryParams = { skip, limit };
  if (topic) {
    queryParams.topic = topic;
  }
  const query = createQuery(queryParams);
  return fetch(`${config.baseUrl}${config.assistant}${config.qna}?${query}`, {
    headers: {
      ...headers,
      'Current-User': currentUser,
      ...getAuthHeaders(),
    },
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });
};
export const getAssistantFaqTopics = currentUser =>
  fetch(`${config.baseUrl}${config.assistant}${config.qna}${config.topics}`, {
    headers: {
      ...headers,
      'Current-User': currentUser,
      ...getAuthHeaders(),
    },

    method: 'GET',
  })
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return error;
    });

export const searchAssistantFaq = (currentUser, search, topic = null, skip = 0, limit = null) => {
  const queryParams = { search, skip };
  if (topic) {
    queryParams.topic = topic;
  }
  if (limit) {
    queryParams.limit = limit;
  }
  const query = createQuery(queryParams);
  return fetch(`${config.baseUrl}${config.assistant}${config.qna}${config.search}?${query}`, {
    headers: {
      ...headers,
      'Current-User': currentUser,
      ...getAuthHeaders(),
    },

    method: 'GET',
  })
    .then(res => {
      if (!res.ok) {
        return res
          .json()
          .then(err => {
            throw new Error(err.message || `HTTP ${res.status}: ${res.statusText}`);
          })
          .catch(() => {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          });
      }
      return res.json();
    })
    .then(res => res)
    .catch(error => {
      console.error('API Client error:', error);

      return { error: error.message || 'Failed to search FAQs' };
    });
};

export default null;
