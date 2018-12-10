import fetch from 'isomorphic-fetch';
import config from './routes';

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

export const getFeedContentByObject = name =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${name}/posts`, {
      headers,
      method: 'POST',
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getMoreFeedContentByObject = ({ tag, startAuthor, startPermlink, limit }) =>
  new Promise((resolve, reject) => {
    fetch(`${config.apiPrefix}${config.getObjects}/${tag}/posts`, {
      headers,
      method: 'POST',
      body: JSON.stringify({ tag, startAuthor, startPermlink, limit }),
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

export default null;
