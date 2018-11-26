import fetch from 'isomorphic-fetch';
import config from './config.json';

export const getRecommendedObjects = () =>
  fetch(`${config.API_HOST_development}${config.getObjects}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userLimit: 5, locale: 'en-US' }),
  }).then(res => res.json());

export const getObjects = () =>
  fetch(`${config.API_HOST_development}${config.getObjects}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userLimit: 5, locale: 'en-US' }),
  }).then(res => res.json());

export const getObject = name =>
  fetch(`${config.API_HOST_development}${config.getObjects}${name}`).then(res => res.json());

export const getUsersByObject = object =>
  fetch(`${config.API_HOST_development}${config.getObjects}${object}`).then(res => res.json());

export const getFeedContentByObject = name =>
  new Promise((resolve, reject) => {
    fetch(`${config.API_HOST_development}${config.getObjects}${name}/posts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export const getMoreFeedContentByObject = ({ tag, startAuthor, startPermlink, limit }) =>
  new Promise((resolve, reject) => {
    fetch(`${config.API_HOST_development}${config.getObjects}${tag}/posts`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag, startAuthor, startPermlink, limit }),
    })
      .then(res => res.json())
      .then(posts => resolve(posts))
      .catch(error => reject(error));
  });

export default null;
