import apiFactory from '../api';
import config from './config';

export const baseUrl = config[process.env.NODE_ENV].apiPrefix + config.versionApi;

export default apiFactory({
  apiPrefix: baseUrl,
});
