import config from './config.json';

export const baseUrl = config[process.env.NODE_ENV].protocol + config[process.env.NODE_ENV].host;

const routes = {
  ...config,
  appName: config[process.env.NODE_ENV].appName,
  apiPrefix: baseUrl + config.apiPrefix,
  objectsBotApiPrefix: baseUrl + config.objectsBotApiPrefix,
  campaignApiPrefix: baseUrl + config.campaignApiPrefix,
};

export default routes;
