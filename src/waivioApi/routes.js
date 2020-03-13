import config from './config.json';
import iaConfig from '../investarena/etc/client-config.json';

export const baseUrl = config[process.env.NODE_ENV].protocol + config[process.env.NODE_ENV].host;
const cryptoArenaBaseUrl = iaConfig[process.env.NODE_ENV].apiPrefix;

const routes = {
  ...config,
  appName: config[process.env.NODE_ENV].appName,
  baseUrl,
  apiPrefix: baseUrl + config.apiPrefix,
  bxyApiPrefix: cryptoArenaBaseUrl + config.bxyApiPrefix,
  objectsBotApiPrefix: baseUrl + config.objectsBotApiPrefix,
  campaignApiPrefix: baseUrl + config.campaignApiPrefix,
};

export default routes;
