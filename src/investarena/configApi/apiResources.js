import apiFactory from '../api';
import config from './config';

export const baseUrl = config[process.env.NODE_ENV].apiPrefix + config.versionApi;

export const invArena = {
  baseUrl: config[process.env.NODE_ENV].apiPrefix,
};

export default apiFactory({
  apiPrefix: baseUrl,
});
