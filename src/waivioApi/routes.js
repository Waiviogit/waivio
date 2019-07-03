import config from './config.json';

const baseUrl = config[process.env.NODE_ENV].protocol + config[process.env.NODE_ENV].host;
const routes = {
  ...config,
  apiPrefix: baseUrl + config.apiPrefix,
  objectsBotApiPrefix: baseUrl + config.objectsBotApiPrefix,
};

export default routes;
