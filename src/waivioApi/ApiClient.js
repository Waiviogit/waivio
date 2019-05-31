import fetch from 'isomorphic-fetch';
import config from './routes';
import { getFollowingCount } from '../client/helpers/apiHelpers';
import { supportedObjectTypes } from '../investarena/constants/objectsInvestarena';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const filterKey = 'investarena';

const getFilterKey = () => {
  if (localStorage) {
    const isAppFilterOff = localStorage.getItem('isAppFilterOff');
    return isAppFilterOff ? '' : filterKey;
  }
  return filterKey;
};

export function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const getRecommendedObjects = () =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ userLimit: 5, locale: 'en-US', limit: 6 }),
  }).then(res => res.json());

export const getObjects = ({
  limit = 30,
  locale = 'en-US',
  skip = 0,
  invObjects,
  requiredFields = [],
}) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({
      limit,
      locale,
      skip,
      object_types: invObjects ? supportedObjectTypes : [],
      required_fields: requiredFields,
    }),
  }).then(res => res.json());

export const getObjectsByIds = ({ authorPermlinks = [], locale = 'en-US' }) =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ author_permlinks: authorPermlinks, locale }),
  }).then(res => res.json());

export const getObject = (authorPermlink, username) => {
  const query = `?required_fields=chartid${username ? `&user=${username}` : ''}`;

  return fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${query}`).then(res =>
    res.json(),
  );
};

export const getUsersByObject = object =>
  fetch(`${config.apiPrefix}${config.getObjects}/${object}`).then(res => res.json());

export const getFeedContentByObject = (name, limit = 10) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${name}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ limit }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getMoreFeedContentByObject = ({ authorPermlink, skip = 0, limit = 10 }) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
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

export const postCreateWaivioObject = requestBody =>
  new Promise((resolve, reject) => {
    fetch(`${config.objectsBot.apiPrefix}${config.objectsBot.createObject}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getUserFeedContent = (feedUserName, limit = 10) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${feedUserName}${config.feed}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        limit,
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

export const getMoreUserFeedContent = ({
  userName,
  limit = 10,
  startAuthor = '',
  startPermlink = '',
  countWithWobj = '',
}) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.feed}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        count_with_wobj: countWithWobj,
        limit,
        start_author: startAuthor,
        start_permlink: startPermlink,
        filter: {
          byApp: getFilterKey(),
        },
      }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const searchObjects = (searchString, limit = 10) =>
  fetch(`${config.apiPrefix}${config.searchObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ search_string: searchString, limit }),
  }).then(res => res.json());

export const postAppendWaivioObject = postData =>
  new Promise((resolve, reject) => {
    fetch(`${config.objectsBot.apiPrefix}${config.objectsBot.appendObject}`, {
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

export const getWobjectsWithUserWeight = (userName, skip = 0, limit = 30) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.user}/${userName}${config.wobjectsWithUserWeight}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getWobjectsFeed = (limit = 20, skip = 0) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getWobjFeed}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        skip,
        limit,
        filter: {
          byApp: getFilterKey(),
        },
      }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });

export const getWobjectsExpertise = (authorPermlink, skip = 0, limit = 30) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}${config.wobjectsExpertise}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ skip, limit }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve(result))
      .catch(error => reject(error));
  });
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

export const getObjectType = (name, wobjects_skip = 0, filter) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.objectType}/${name}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ wobjects_count: 250, wobjects_skip, filter }),
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
    fetch(`${config.apiPrefix}${config.objectType}`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ object_types: [type], skip, limit, filter }),
    })
      .then(handleErrors)
      .then(res => res.json())
      .then(result => resolve({ data: result, type }))
      .catch(error => reject(error));
  });

// Investarena


export const getInstrumentLongTermStatistics = id =>
  new Promise((resolve, reject) => {
    fetch(
      `https://informer.maximarkets.org/wss/api/quotation/${id}/Day/730/?withCurrentBar=true&param=ask`,
      {
        headers,
        method: 'GET',
      },
    )
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });

export const getUserLongTermStatistics = id =>
  new Promise((resolve, reject) => {
    fetch(`https://waiviodev.com/investarena-api${config.userStatistics}/${id}`, {
      headers,
      method: 'GET',
    })
      .then(res => res.json())
      .then(data => resolve(data))
      .catch(error => reject(error));
  });
// END Investarena

export default null;
