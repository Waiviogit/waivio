import fetch from 'isomorphic-fetch';
import config from './routes';
import { getFollowingCount } from '../client/helpers/apiHelpers';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
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
    body: JSON.stringify({ userLimit: 5, locale: 'en-US' }),
  }).then(res => res.json());

export const getObjects = () =>
  fetch(`${config.apiPrefix}${config.getObjects}`, {
    headers,
    method: 'POST',
    body: JSON.stringify({ userLimit: 5, locale: 'en-US' }),
  }).then(res => res.json());

export const getObject = name =>
  fetch(`${config.apiPrefix}${config.getObjects}/${name}`).then(res => res.json());

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

export const getMoreFeedContentByObject = ({ authorPermlink, startId, limit = 10 }) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${authorPermlink}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ start_id: startId, limit }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const postCreateWaivioObject = wObject =>
  fetch(`${config.objectsBot.url}${config.objectsBot.createObject}`, {
    headers,
    method: 'POST',
    body: JSON.stringify(wObject),
  }).then(res => res.json());

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
      .then(result => resolve(result))
      .catch(error => reject(error));
  }).then(({ followers }) => followers.map(user => user.name));

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

export default null;
