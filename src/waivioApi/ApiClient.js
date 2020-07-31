/* eslint-disable */
import { isEmpty, omit, ceil } from 'lodash';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import { message } from 'antd';
import store from 'store';

import config from './routes';
import { getValidTokenData } from '../client/helpers/getToken';
import { GUEST_ACCOUNT_UPDATE, CUSTOM_JSON } from '../common/constants/accountHistory';
import { getUrl } from '../client/rewards/rewardsHelper';
import { getGuestAccessToken } from '../client/helpers/localStorageHelpers';

let headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export function handleErrors(response) {
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return response;
}

export function handleErrorReserve(response) {
  if (response.ok) {
    return response;
  }
  return response.json().then(data => {
    throw Error(data.message);
  });
}

export function handleValidateCampaignErrors(response) {
  if (!response.ok) {
    return response.json().then(data => Promise.reject(data));
  }
  return response;
}

export const getRecommendedObjects = () =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: { ...headers, app: config.appName },
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
  follower,
}) => {
  const reqData = { limit, locale, skip };

  if (isOnlyHashtags) reqData.object_types = ['hashtag'];
  else reqData.exclude_object_types = ['hashtag'];
  return fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: {
      ...headers,
      app: config.appName,
      follower: follower,
    },
    method: 'POST',
    body: JSON.stringify(reqData),
  }).then(res => res.json());
};

export const getObjectsByIds = ({ authorPermlinks = [], locale = 'en-US', requiredFields = [] }) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers: {
      ...headers,
      app: config.appName,
    },
    method: 'POST',
    body: JSON.stringify({
      author_permlinks: authorPermlinks,
      locale,
      required_fields: requiredFields,
    }),
  }).then(res => res.json());

export const getObject = (authorPermlink, user, requiredField = []) => {
  let queryString = '';

  if (requiredField.length) {
    queryString = Array.isArray(requiredField)
      ? requiredField.reduce((acc, field, index) => {
          if (index !== requiredField.length - 1) {
            return `${acc}required_fields=${field}&`;
          }

          return `${acc}required_fields=${field}`;
        }, '')
      : `required_fields=${requiredField}`;
  }

  queryString = user ? `?user=${user}&${queryString}` : `?${queryString}`;

  return fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${queryString}`, {
    headers: {
      app: config.appName,
      follower: user,
    },
  })
    .then(handleErrors)
    .then(res => res.json());
};

export const getUsersByObject = object =>
  fetch(`${config.apiPrefix}${config.getObjects}/${object}`).then(res => res.json());

// region Feed requests
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
  lastId,
}) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit, user_languages, lastId }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });
export const getFeedContent = (sortBy, queryData) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.posts}`, {
      headers: {
        ...headers,
        app: config.appName,
      },
      method: 'POST',
      body: JSON.stringify(queryData),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getUserProfileBlog = (
  userName,
  { startAuthor = '', startPermlink = '', limit = 10, skip },
) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.blog}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        limit,
        skip,
        start_author: startAuthor,
        start_permlink: startPermlink,
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
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

export const getMoreUserFeedContent = ({
  userName,
  limit = 10,
  skip = 0,
  user_languages,
  lastId,
}) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.feed}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        skip,
        limit,
        user_languages,
        lastId,
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });
// endregion

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

export const searchUsers = (searchString, username, limit = 15) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.apiPrefix}${config.users}${config.search}?searchString=${searchString}&limit=${limit}`,
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
  fetch(`${config.objectsBotApiPrefix}${config.objectsBot.appendObject}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(postData),
  })
    .then(res => res.json())
    .catch(error => error);

// region Follow API requests
export const getAllFollowingObjects = (username, skip, limit, authUser) => {
  const actualHeaders = authUser ? { ...headers, follower: authUser } : headers;

  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${username}${config.followingObjects}`, {
      method: 'POST',
      headers: {
        ...actualHeaders,
        app: config.appName,
      },
      body: JSON.stringify({ limit, skip }),
    })
      .then(res => res.json())
      .then(res => resolve(res.map(obj => obj.author_permlink)))
      .catch(error => reject(error));
  });
};

export const getWobjectFollowers = (wobject, skip = 0, limit = 50, authUser) => {
  const actualHeaders = authUser
    ? { ...headers, following: authUser, follower: authUser }
    : headers;

  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getObjectFollowers}`, {
      headers: actualHeaders,
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result || []))
      .catch(error => reject(error));
  });
};

export const getWobjectFollowing = (userName, skip = 0, limit = 50, authUser) => {
  const actualHeaders = authUser
    ? { ...headers, following: authUser, follower: authUser }
    : headers;

  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.followingObjects}`, {
      headers: {
        ...actualHeaders,
        app: config.appName,
      },
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getUserAccount = (username, withFollowings = false, authUser) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${username}?with_followings=${withFollowings}`, {
      headers: {
        ...headers,
        following: authUser,
        follower: authUser,
      },
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getFollowingUpdates = (userName, count = 5) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.apiPrefix}${config.user}/${userName}${config.followingUpdates}?users_count=${count}&wobjects_count=${count}`,
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

export const getFollowingObjectsUpdates = (follower, objType, limit = 5, skip = 0) =>
  new Promise((resolve, reject) => {
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
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getFollowingUsersUpdates = (userName, limit = 5, skip = 0) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.apiPrefix}${config.user}/${userName}${config.followingUsersUpdates}?limit=${limit}&skip=${skip}`,
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
// endregion

export const getWobjectGallery = wobject =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${wobject}${config.getGallery}`, {
      headers: {
        app: config.appName,
      },
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
  authUser,
  objectTypes,
  excludeObjectTypes,
) => {
  const reqData = { skip, limit };
  if (objectTypes) reqData.object_types = objectTypes;
  if (excludeObjectTypes) reqData.exclude_object_types = excludeObjectTypes;

  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.wobjectsWithUserWeight}`, {
      headers: {
        ...headers,
        follower: authUser,
        app: config.appName,
      },
      method: 'POST',
      body: JSON.stringify(reqData),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};
export const getWobjectsExpertise = (user, authorPermlink, skip = 0, limit = 30) => {
  const actualHeader = user ? { ...headers, following: user, follower: user } : headers;

  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.wobjectsExpertise}`, {
      headers: { ...actualHeader, app: config.appName },
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

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
        headers: {
          ...headers,
          app: config.appName,
        },
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

export const getObjectType = (typeName, requestData) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.objectType}/${typeName}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(requestData),
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });

export const getSearchResult = (string, userLimit = 3, wobjectsLimit, objectTypesLimit = 5, user) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.generalSearch}`, {
      headers: {
        ...headers,
        following: user,
        follower: user,
        app: config.appName,
      },
      method: 'POST',
      body: JSON.stringify({ string, userLimit, wobjectsLimit, objectTypesLimit }),
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

export const getTopUsers = (user, { limit = 30, skip = 0, isRandom = false } = {}) => {
  const queryString = `?${isRandom ? 'sample=true' : `limit=${limit}&skip=${skip}`}`;
  const actualHeaders = user ? { ...headers, following: user, follower: user } : headers;

  return new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.users}${queryString}`, {
      headers: actualHeaders,
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
};

// region Campaigns Requests

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
  match,
  simplified,
  firstMapLoad,
  isMap,
}) =>
  new Promise((resolve, reject) => {
    const reqData = {
      limit,
      skip,
      status,
      approved,
      requiredObject,
      sort,
    };

    if (!isEmpty(coordinates)) {
      reqData.coordinates = coordinates;
      reqData.radius = radius;
    }
    if (!isEmpty(area) && isEmpty(requiredObject)) {
      reqData.area = area;
      if (radius) reqData.radius = radius;
    }
    if (!isEmpty(guideNames)) reqData.guideNames = guideNames;
    if (!isEmpty(types)) reqData.types = types;
    if (!isEmpty(userName)) reqData.userName = userName;
    if (currentUserName) reqData.currentUserName = currentUserName;
    if (!requiredObject && simplified) reqData.simplified = simplified;
    if (!requiredObject && firstMapLoad) reqData.firstMapLoad = firstMapLoad;
    if (!isMap && match.params.filterKey === 'reserved') reqData.update = true;

    const url = getUrl(match);

    fetch(url, {
      headers,
      method: 'POST',
      body: JSON.stringify(reqData),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getHistory = ({
  limit = 10,
  skip = 0,
  guideName,
  userName,
  onlyWithMessages,
  sort,
  caseStatus,
  rewards,
  status,
  guideNames,
}) =>
  new Promise((resolve, reject) => {
    const reqData = {
      limit,
      skip,
      onlyWithMessages,
      sort,
    };
    /* If we have userName, we sent request from history page. On history page we should display all propositions: with messages and without */
    /* If we have guideName, we sent request from messages page. On this page we should display only propositions with messages */

    if (userName) {
      reqData.userName = userName;
      reqData.onlyWithMessages = false;
    }
    if (guideName) reqData.guideName = guideName;
    if (!isEmpty(rewards)) reqData.rewards = rewards;
    if (!isEmpty(status)) reqData.status = status;
    if (!isEmpty(guideNames)) reqData.guideNames = guideNames;
    if (!isEmpty(caseStatus)) reqData.caseStatus = caseStatus;
    fetch(`${config.campaignApiPrefix}${config.campaigns}${config.history}`, {
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
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(handleValidateCampaignErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const validateInactivationCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.inactivation}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const reserveActivatedCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.reservation}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(handleErrorReserve)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const rejectReservationCampaign = data =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.rejectReservation}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getFilteredCampaignsByGuideName = (guideName, status) =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.campaigns}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        guideNames: [guideName],
        status,
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

export const getRewardsGeneralCounts = ({ userName, sort, limit = 30, skip = 0 } = {}) =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.statistics}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        userName: userName,
        sort,
        limit,
        skip,
      }),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getMatchBotRules = guideName =>
  new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.matchBots}/?bot_name=${guideName}`, {
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
      headers,
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

export const getLenders = ({ sponsor, user, globalReport, filters }) => {
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
            sponsor: sponsor,
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
      return preparedObject;
    }
    return {
      userName: user,
      sponsor,
      globalReport,
    };
  };

  return new Promise((resolve, reject) => {
    fetch(`${config.campaignApiPrefix}${config.payments}${config.payables}`, {
      headers,
      method: 'POST',
      body: JSON.stringify(getBody(filters)),
    })
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
};

export const getReport = ({ guideName, userName, reservationPermlink }) =>
  new Promise((resolve, reject) => {
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
      .then(result => resolve(result))
      .catch(error => reject(error));
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
  let isGuest = null;
  const token = getGuestAccessToken();
  isGuest = token === 'null' ? false : Boolean(token);

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

export const getGuestPaymentsHistory = async (userName, { skip = 0, limit = 10 } = {}) => {
  const token = await getValidTokenData();
  return new Promise((resolve, reject) => {
    fetch(
      `${config.campaignApiPrefix}${config.payments}${config.demoPayables}?userName=${userName}&skip=${skip}&limit=${limit}`,
      {
        headers: { ...headers, 'access-token': token.token, 'waivio-auth': true },
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
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
    `${config.baseUrl}${config.auth}/${config.hasSocialAccount}?id=${id}&provider=${socialNetwork}`,
  )
    .then(data => data.json())
    .then(data => data.result);

export const broadcastGuestOperation = async (operationId, isReview, data) => {
  const userData = await getValidTokenData();
  if (userData.token) {
    let body;
    if (isReview) {
      body = {
        id: operationId,
        data: { operations: data },
        userName: userData.userData.name,
        guestReview: true,
      };
    } else {
      body = {
        id: operationId,
        data: { operations: data },
        userName: userData.userData.name,
      };
    }

    return fetch(`${config.baseUrl}${config.auth}${config.guestOperations}`, {
      method: 'POST',
      headers: { ...headers, 'access-token': userData.token },
      body: JSON.stringify(body),
    }).then(res => res);
  }
};
// endregion

export const getFollowersFromAPI = (username, limit = 10, skip = 0) =>
  fetch(
    `${config.apiPrefix}${config.user}/${username}${config.getObjectFollowers}?skip=${skip}&limit=${limit}`,
    {
      headers: {
        ...headers,
        following: username,
        follower: username,
      },
    },
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.error(err));

export const getFollowingsFromAPI = (username, limit = 100, skip = 0, authUser) => {
  const actualHeaders = authUser
    ? { ...headers, following: authUser, follower: authUser }
    : headers;

  return fetch(
    `${config.apiPrefix}${config.user}/${username}${config.followingUsers}?skip=${skip}&limit=${limit}`,
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

export const getUserCommentsFromApi = (username, skip = 0, limit = 10, startPermlink) => {
  let res;
  if (startPermlink) {
    res = fetch(
      `${config.apiPrefix}${config.user}/${username}${config.comments}?skip=${skip}&limit=${limit}&start_permlink=${startPermlink}`,
    );
  } else {
    res = fetch(
      `${config.apiPrefix}${config.user}/${username}${config.comments}?skip=${skip}&limit=${limit}`,
    );
  }
  return res
    .then(responsive => responsive.json())
    .then(data => data)
    .catch(err => err);
};

export const getPostCommentsFromApi = ({ category, author, permlink }) =>
  fetch(
    `${config.apiPrefix}${config.postComments}?author=${author}&permlink=${permlink}&category=${category}`,
  )
    .then(res => res.json())
    .then(data => data)
    .catch(err => err);

export const getRecommendTopic = (limit = 30, locale = 'en-US', skip = 0, listHashtag) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      limit,
      skip,
      locale,
      author_permlinks: listHashtag,
      object_types: ['hashtag'],
    }),
  }).then(res => res.json());

export const getUsers = ({ listUsers, userName, skip = 0, limit = 20 }) => {
  const actualHeaders = userName
    ? { ...headers, following: userName, follower: userName }
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
  ).then(res => res.json());

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
  fetch(
    `${config.campaignApiPrefix}${config.withdraw}${config.validateAddress}?address=${address}&crypto=${crypto}`,
    {
      headers,
      method: 'GET',
    },
  ).then(res => res.json());

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

export const getTransferDetails = withdrawId => {
  return fetch(
    `${config.campaignApiPrefix}${config.withdraw}${config.getWithdrawData}?id=${withdrawId}`,
    {
      headers,
      method: 'GET',
    },
  ).then(res => res.json());
};

// injected as extra argument in Redux Thunk
export const waivioAPI = {
  getAuthenticatedUserMetadata,
  broadcastGuestOperation,
  getUserAccount,
};

export const getTransferHistory = (username, limit = 10, operationNum = -1) =>
  new Promise((resolve, reject) => {
    fetch(
      `${config.campaignApiPrefix}${config.payments}${config.transfers_history}?userName=${username}&limit=${limit}&operationNum=${operationNum}`,
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

export default null;
