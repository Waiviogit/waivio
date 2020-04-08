import config from './config.json';
import { invArena } from '../investarena/configApi/apiResources';

export const baseUrl = config[process.env.NODE_ENV].protocol + config[process.env.NODE_ENV].host;

const routes = {
  ...config,
  appName: config[process.env.NODE_ENV].appName,
  baseUrl,
  apiPrefix: baseUrl + config.apiPrefix,
  bxyApiPrefix: invArena.baseUrl + config.bxyApiPrefix,
  objectsBotApiPrefix: baseUrl + config.objectsBotApiPrefix,
  campaignApiPrefix: baseUrl + config.campaignApiPrefix,
  currenciesApiPrefix: baseUrl + config.currenciesApiPrefix,
};

export default routes;
