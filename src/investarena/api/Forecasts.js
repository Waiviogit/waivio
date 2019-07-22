import Base from './Base';
import config from '../configApi/config';

export default class Forecasts extends Base {
  constructor(params) {
    super(params);

    this.getActiveForecasts = this.getActiveForecasts.bind(this);
  }

  getActiveForecasts(name = '', quote = '') {
    return this.apiClient
      .get(`${config.forecasts.activeForecasts}?name=${name}&quote=${quote}`)
      .then(response => response.data);
  }
}
