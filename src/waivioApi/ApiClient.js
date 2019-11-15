/* eslint-disable */
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import config from './routes';
import { getFollowingCount } from '../client/helpers/apiHelpers';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
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

export const getObjects = ({ limit = 30, locale = 'en-US', skip = 0, isOnlyHashtags }) => {
  const reqData = { limit, locale, skip };
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

export const getObject = (authorPermlink, username) => {
  const query = username ? `?user=${username}` : '';

  return fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${query}`, {
    headers: {
      app: config.appName,
    },
  }).then(res => res.json());
};

export const getUsersByObject = object =>
  fetch(`${config.apiPrefix}${config.getObjects}/${object}`).then(res => res.json());

export const getFeedContentByObject = (name, limit = 10, user_languages) =>
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
      body: JSON.stringify({ limit, user_languages }),
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
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const searchObjects = (searchString, objType = '', forParent, limit = 15) => {
  const requestBody = { search_string: searchString, limit };
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

export const getAllFollowingObjects = username =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${username}`)
      .then(res => res.json())
      .then(user => resolve(user.objects_follow || []))
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

export const getUserAccount = username =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${username}`)
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
    fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getGallery}`)
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
      body: JSON.stringify({ string: text, userLimit, wobjectsLimit, objectTypesLimit }),
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
      .then(result => resolve(result.users))
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

export const updateUserMetadata = (userName, data) =>
  fetch(`${config.apiPrefix}${config.user}/${userName}${config.userMetadata}`, {
    headers: { ...headers, 'access-token': Cookie.get('access_token') },
    method: 'PUT',
    body: JSON.stringify({ user_metadata: data }),
  }).then(res => res.json());
//endregion

// injected as extra argument in Redux Thunk
export const waivioAPI = {
  getAuthenticatedUserMetadata,
};

export default null;
