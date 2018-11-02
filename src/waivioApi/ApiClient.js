import fetch from 'isomorphic-fetch';
import config from './config.json';

export const getRecommendedObjects = () =>
  fetch(`${config.API_HOST_development}${config.getObjects}`).then(res => res.json());

export const getObjects = () =>
  fetch(`${config.API_HOST_development}${config.getObjects}`).then(res => res.json());

export default null;
