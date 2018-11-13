import fetch from 'isomorphic-fetch';
import config from './config.json';

export const getRecommendedObjects = () =>
  fetch(`${config.API_HOST_development}${config.getObjects}`).then(res => res.json());

export const getObjects = () =>
  fetch(`${config.API_HOST_development}${config.getObjects}`).then(res => res.json());

export const getObject = name =>
  fetch(`${config.API_HOST_development}${config.getObjects}${name}`).then(res => res.json());

export const getUsersByObject = object =>
  fetch(`${config.API_HOST_development}${config.getObjects}${object}`).then(res => res.json());

export const getFeedContentByObject = name => {
  fetch(`${config.API_HOST_development}${config.getObjects}${name}`)
    .then(res => res.json())
    .then(json => ({ posts: json.posts }));
};

export default null;
