import Base from './Base';
import config from '../configApi/config';

export default class QuickForecast extends Base {
  constructor(params) {
    super(params);

    this.getQuickForecast = this.getQuickForecast.bind(this);
    this.getQuickForecastStatistics = this.getQuickForecastStatistics.bind(this);
    this.getQuickForecastWinners = this.getQuickForecastWinners.bind(this);
    this.getQuickForecastRewards = this.getQuickForecastRewards.bind(this);
  }

  getQuickForecast(userName) {
    return this.apiClient
      .get(`${config.investArenaApi}${config.quickForecasts.quickForecast}/${userName}/feed`)
      .then(response => response.data);
  }

  getQuickForecastStatistics(userName) {
    return this.apiClient
      .get(`${config.investArenaApi}${config.quickForecasts.quickForecastStatistics}/${userName}/statistics`)
      .then(response => response.data);
  }

  getQuickForecastWinners(user, limit, skip) {
    return this.apiClient
      .post(`${config.investArenaApi}${config.quickForecasts.quickForecastWinners}`, {user, limit, skip})
      .then(response => response.data);
  }

  getQuickForecastRewards() {
    return this.apiClient
      .get(`${config.investArenaApi}${config.quickForecasts.quickForecastRewards}`)
      .then(response => response.data);
  }
}
