/* eslint-disable */
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import config from './routes';
import { baseUrl as investarenaConfig } from '../investarena/configApi/apiResources';
import { getFollowingCount } from '../client/helpers/apiHelpers';
import { getValidTokenData } from '../client/helpers/getToken';
import { supportedObjectTypes } from '../investarena/constants/objectsInvestarena';

const filterKey = 'investarena';

let headers = {
  app: filterKey,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const getFilterKey = () => {
  if (localStorage) {
    const isAppMyFeedFilterOn = !localStorage.getItem('isAppMyFeedFilterOn');
    return isAppMyFeedFilterOn ? '' : filterKey;
  }
  return filterKey;
};

export function handleErrors(response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

export const getRecommendedObjects = () =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      userLimit: 5,
      locale: 'en-US',
      limit: 6,
      exclude_object_types: ['hashtag'],
      sample: true,
    }),
  }).then(res => res.json());

export const getObjects = ({
  limit = 30,
  locale = 'en-US',
  skip = 0,
  isOnlyHashtags,
  invObjects,
  requiredFields = [],
  userLimit = 0,
}) => {
  const reqData = {
    limit,
    locale,
    skip,
    object_types: invObjects ? supportedObjectTypes : [],
    required_fields: requiredFields,
    user_limit: userLimit,
  };
  if (isOnlyHashtags) reqData.object_types = ['hashtag'];
  else reqData.exclude_object_types = ['hashtag'];
  return fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(reqData),
  }).then(res => res.json());
};

export const getObjectsByIds = ({ authorPermlinks = [], locale = 'en-US' }) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ author_permlinks: authorPermlinks, locale }),
  }).then(res => res.json());

export const getObject = (authorPermlink, requiredField) => {
  const query = requiredField ? `?required_fields=${requiredField}` : '';

  return fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${query}`, {
    headers,
  }).then(res => res.json());
};

export const getUsersByObject = object =>
  fetch(`${config.apiPrefix}${config.getObjects}/${object}`).then(res => res.json());

export const getFeedContentByObject = (name, limit = 10, user_languages = ['en-US', 'ru-RU']) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${name}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ limit, user_languages }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

// eslint-disable-next-line camelcase
export const getMoreFeedContentByObject = ({
  authorPermlink,
  skip = 0,
  limit = 10,
  user_languages,
}) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit, user_languages }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getFeedContentWithForecastsByObject = (objectPermlink, skip, limit) =>
  new Promise((resolve, reject) => {
    fetch(
      `${investarenaConfig}${config.posts}/${config.withForecastByWobject}/${objectPermlink}?skip=${skip}&limit=${limit}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getFeedContent = (sortBy, queryData) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.posts}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(queryData),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getUserProfileBlog = (
  userName,
  { startAuthor = '', startPermlink = '', limit = 10 },
) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.blog}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        limit,
        start_author: startAuthor,
        start_permlink: startPermlink,
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getUserProfileBlogForecasts = (userName, skip, limit) =>
  new Promise((resolve, reject) => {
    fetch(
      `${investarenaConfig}${config.posts}/${config.withForecastByUser}/${userName}?skip=${skip}&limit=${limit}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const postCreateWaivioObject = requestBody =>
  new Promise((resolve, reject) => {
    fetch(`${config.objectsBotApiPrefix}${config.objectsBot.createObject}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getUserFeedContent = (feedUserName, limit = 10, user_languages) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${feedUserName}${config.feed}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        limit,
        user_languages,
        filter: {
          byApp: getFilterKey(),
        },
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getContent = (author, permlink) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.post}/${author}/${permlink}`, {
      headers,
      method: 'GET',
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getMoreUserFeedContent = ({ userName, limit = 10, skip = 0, user_languages }) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.feed}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        skip,
        limit,
        user_languages,
        filter: {
          byApp: getFilterKey(),
        },
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const searchObjects = (searchString, objType = '', forParent, limit = 15) => {
  const requestBody = { search_string: searchString, limit, sortByApp: 'investarena' };
  if (objType && typeof objType === 'string') requestBody.object_type = objType;
  if (forParent && typeof forParent === 'string') requestBody.forParent = forParent;
  return fetch(`${config.apiPrefix}${config.searchObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(requestBody),
  })
    .then(handleErrors)
    .then(res => res.json());
};

export const searchUsers = (searchString, limit = 15) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.apiPrefix}${config.users}${config.search}?searchString=${searchString}&limit=${limit}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
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
  new Promise((resolve, reject) => {
    fetch(`${config.objectsBotApiPrefix}${config.objectsBot.appendObject}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(postData),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getAllFollowingObjects = (username, skip, limit) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${username}${config.followingObjects}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ limit, skip }),
    })
      .then(res => res.json())
      .then(res => resolve(res.map(obj => obj.author_permlink)))
      .catch(error => reject(error));
  });

export const getWobjectFollowers = (wobject, skip = 0, limit = 50) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getObjectFollowers}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result || []))
      .catch(error => reject(error));
  });

export const getWobjectFollowing = (wobject, skip = 0, limit = 50) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${wobject}${config.followingObjects}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getUserAccount = (username, with_followings = false) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${username}?with_followings=${with_followings}`)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getAccountWithFollowingCount = username =>
  Promise.all([getUserAccount(username), getFollowingCount(username)]).then(
    ([account, following]) => ({
      ...account,
      following_count: following.following_count,
      follower_count: following.follower_count,
    }),
  );

export const getWobjectGallery = wobject =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getGallery}`, {
      headers,
      method: 'GET',
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getWobjectsWithUserWeight = (
  userName,
  skip = 0,
  limit = 30,
  objectTypes,
  excludeObjectTypes,
) => {
  const reqData = { skip, limit };
  if (objectTypes) reqData.object_types = objectTypes;
  if (excludeObjectTypes) reqData.exclude_object_types = excludeObjectTypes;
  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.wobjectsWithUserWeight}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(reqData),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
export const getWobjectsExpertise = (user, authorPermlink, skip = 0, limit = 30) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.wobjectsExpertise}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit, user }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getObjectExpertiseByType = (objectType, skip = 0, limit = 5) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.apiPrefix}${config.objectType}/${objectType}${config.typeExpertise}?limit=${limit}&skip=${skip}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getAuthorsChildWobjects = (authorPermlink, skip = 0, limit = 30) =>
  new Promise((resolve, reject) =>
    fetch(
      `${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.childWobjects}?limit=${limit}&skip=${skip}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error)),
  );

export const getObjectTypes = (limit = 10, skip = 0, wobjects_count = 3) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjectTypes}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ limit, skip, wobjects_count }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getObjectType = (
  typeName,
  { limit: wobjects_count, skip: wobjects_skip, filter, sort }, // eslint-disable-line
) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.objectType}/${typeName}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ wobjects_count, wobjects_skip, filter, sort }),
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });

export const getSearchResult = (text, userLimit = 3, wobjectsLimit, objectTypesLimit = 5) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.generalSearch}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        string: text,
        userLimit,
        wobjectsLimit,
        objectTypesLimit,
        sortByApp: 'investarena',
      }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getMoreObjectsByType = (type, skip, limit, filter = {}) =>
  new Promise((resolve, reject) => {
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
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve({ data: result, type }))
      .catch(error => reject(error));
  });

export const getMessagesQuantity = username => {
  return new Promise((resolve, reject) => {
    fetch(`https://staging.stchat.cf/api/user/${username}/unread_count`, {
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

export const getTopUsers = (isRandom = false, { limit, skip } = { limit: 30, skip: 0 }) => {
  const queryString = `?${isRandom ? 'sample=true' : `limit=${limit}&skip=${skip}`}`;
  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.users}${queryString}`, {
      headers,
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

//region Campaigns Requests

export const getCampaignById = campaignId =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.campaign}/${campaignId}`, {
      headers,
      method: 'GET',
    })
      .then(res => res.json())
      .then(response => resolve(response.campaign))
      .catch(error => reject(error));
  });

export const getPropositions = ({
  limit = 30,
  skip = 0,
  userName = '',
  status,
  approved,
  guideNames,
  types,
  requiredObject,
  currentUserName,
  radius,
  area,
  coordinates,
  sort,
}) =>
  new Promise((resolve, reject) => {
    const reqData = {
      limit,
      skip,
      status,
      approved,
      requiredObject,
      currentUserName,
      sort,
    };

    if (!_.isEmpty(coordinates)) {
      reqData.coordinates = coordinates;
    }
    if (!_.isEmpty(area) && radius) {
      reqData.radius = radius;
      reqData.area = area;
    }
    if (!_.isEmpty(guideNames)) reqData.guideNames = guideNames;
    if (!_.isEmpty(types)) reqData.types = types;
    if (!_.isEmpty(userName)) reqData.userName = userName;

    fetch(`${config.campaignApiPrefix}${config.campaigns}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(reqData),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getSuitableUsers = (followsCount, postsCount) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.campaignApiPrefix}${config.suitableUsers}?count_follows=${followsCount}&count_posts=${postsCount}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(result => resolve({ users: result.users, hasMore: false }))
      .catch(error => reject(error));
  });

export const createCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.createCampaign}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const validateActivationCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.activation}`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const validateInactivationCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.inactivation}`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const reserveActivatedCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.reservation}`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const rejectReservationCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.rejectReservation}`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getFilteredCampaignsByGuideName = (guideName, status) =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.campaigns}`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        guideNames: [guideName],
        status: status,
      }),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getCampaignsByGuideName = guideName =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.campaigns}${config.dashboard}/${guideName}`, {
      headers,
      method: 'GET',
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getCampaignByGuideNameAndObject = (guideName, object) =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.campaigns}`, {
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        guideNames: [guideName],
        requiredObject: object,
      }),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getLenders = ({ sponsor, user, filters }) => {
  const isSponsor = sponsor ? `?sponsor=${sponsor}` : '';
  const payable = filters && filters.payable ? `&payable=${filters.payable}` : '';
  const days = filters && filters.days ? `&days=${filters.days}` : '';
  const isUser = user ? (sponsor ? `&userName=${user}` : `?userName=${user}`) : '';
  return new Promise((resolve, reject) => {
    fetch(
      `${config.campaignApiPrefix}${config.payments}${config.payables}${isSponsor}${isUser}${days}${payable}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
//endregion

//region UserMetadata Requests
export const getAuthenticatedUserMetadata = userName => {
  const { apiPrefix, user, userMetadata } = config;
  return fetch(`${apiPrefix}${user}/${userName}${userMetadata}`, {
    headers,
    method: 'GET',
  })
    .then(res => res.json())
    .then(res => _.omit(res.user_metadata, '_id'));
};

export const updateUserMetadata = async (userName, data) => {
  let isGuest = null;
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    isGuest = token === 'null' ? false : Boolean(token);
  }

  if (isGuest) {
    const token = await getValidTokenData();
    headers = { ...headers, 'access-token': token.token, 'waivio-auth': true };
  } else {
    headers = { ...headers, 'access-token': Cookie.get('access_token') };
  }
  return fetch(`${config.apiPrefix}${config.user}/${userName}${config.userMetadata}`, {
    headers,
    method: 'PUT',
    body: JSON.stringify({ user_metadata: data }),
  }).then(res => res.json());
};

export const getGuestPaymentsHistory = (userName, { skip = 0, limit = 20 }) => {
  return new Promise((resolve, reject) => {
    fetch(
      `${config.campaignApiPrefix}${config.payments}${config.demoPayables}?userName=${userName}&skip=${skip}&limit=${limit}`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getTopPosts = () =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.app}/${config.production.appName}`, {
      headers,
      method: 'GET',
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getFollowersFromAPI = (username, limit = 10, skip = 0) => {
  return fetch(
    `${config.apiPrefix}${config.user}/${username}${config.getObjectFollowers}?skip=${skip}&limit=${limit}`,
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

export const getFollowingsFromAPI = (username, limit = 100, skip = 0) => {
  return fetch(
    `${config.apiPrefix}${config.user}/${username}${config.followingUsers}?skip=${skip}&limit=${limit}`,
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));
};

export const getUserCommentsFromApi = (username, skip = 0, limit = 10, start_permlink) => {
  let res;
  if (start_permlink) {
    res = fetch(
      `${config.apiPrefix}${config.user}/${username}${config.comments}?skip=${skip}&limit=${limit}&start_permlink=${start_permlink}`,
    );
  } else {
    res = fetch(
      `${config.apiPrefix}${config.user}/${username}${config.comments}?skip=${skip}&limit=${limit}`,
    );
  }
  return res
    .then(res => res.json())
    .then(data => data)
    .catch(err => err);
};

export const getPostCommentsFromApi = ({ category, root_author, permlink }) => {
  return fetch(
    `${config.apiPrefix}${config.postComments}?author=${root_author}&permlink=${permlink}&category=${category}`,
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => err);
};
//endregion

//region Guest user's requests
export const getAccessToken = (token, social, regData) => {
  let response = {};
  let body = {};
  body.access_token = token;

  if (!_.isEmpty(regData)) {
    Object.keys(regData).forEach(key => (body[key] = regData[key]));
  }

  return fetch(`${config.baseUrl}${config.auth}/${social}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })
    .then(data => {
      response.token = data.headers.get('access-token');
      response.expiration = data.headers.get('expires-in');
      return data.json();
    })
    .then(data => {
      response.userData = data.user;
      return response;
    })
    .catch(err => err);
};

export const getNewToken = token => {
  let response = {};
  return fetch(`${config.baseUrl}${config.auth}/${config.validateAuthToken}`, {
    method: 'POST',
    headers: { 'access-token': token },
  })
    .then(data => {
      response.token = data.headers.get('access-token');
      response.expiration = data.headers.get('expires-in');
      response.status = data.status;
      return data.json();
    })
    .then(data => {
      response.userData = data.user;
      return response;
    })
    .catch(e => {
      console.error(e.message);
    });
};

export const isUserNameVacant = userName => {
  return fetch(`${config.baseUrl}${config.user}/${userName}`);
};

export const isUserRegistered = (id, socialNetwork) => {
  return fetch(
    `${config.baseUrl}${config.auth}/${config.hasSocialAccount}?id=${id}&provider=${socialNetwork}`,
  )
    .then(data => data.json())
    .then(data => data.result);
};

export const broadcastGuestOperation = async (operationId, data) => {
  const userData = await getValidTokenData();
  if (userData.token) {
    return fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
      method: 'POST',
      headers: { ...headers, 'access-token': userData.token },
      body: JSON.stringify({
        id: operationId,
        data: { operations: data },
        userName: userData.userData.name,
      }),
    }).then(data => data);
  }
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

export const updateGuestProfile = async (username, json_metadata) => {
  const body = {
    id: 'waivio_guest_account_update',
    data: {
      operations: [
        [
          'custom_json',
          {
            required_auths: [],
            required_posting_auths: [username],
            id: 'account_update',
            json: JSON.stringify({
              account: username,
              json_metadata: JSON.stringify(json_metadata),
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

export const sendGuestTransfer = async ({ to, amount, memo }) => {
  const userData = await getValidTokenData();
  const body = {
    id: 'waivio_guest_transfer',
    data: { to, amount: +amount.split(' ')[0] },
  };
  if (memo) body.data.memo = memo;
  return fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
    method: 'POST',
    headers: { ...headers, 'access-token': userData.token },
    body: JSON.stringify(body),
  })
    .then(res => res.json())
    .then(data => data)
    .catch(err => err);
};
//endregion

// injected as extra argument in Redux Thunk
export const waivioAPI = {
  getAuthenticatedUserMetadata,
  broadcastGuestOperation,
  getUserAccount,
};

export default null;
