import Base from './Base';
import config from '../configApi/config';

export default class Performers extends Base {
  constructor(params) {
    super(params);

    this.searchInstrumentsStat = this.searchInstrumentsStat.bind(this);
    this.getMostProfitableUsers = this.getMostProfitableUsers.bind(this);
    this.getUserStatistics = this.getUserStatistics.bind(this);
    this.getInstrumentStatistics = this.getInstrumentStatistics.bind(this);
  }

  searchInstrumentsStat(searchString, limit = 7) {
    return this.apiClient
      .get(
        `${config.performers.searchInstrumentsStatistic}/${encodeURIComponent(
          searchString,
        )}?limit=${limit}`,
      )
      .then(response => response.data);
  }

  getPerformersStatistics() {
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(`${config.performers.top}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
  getPerformersStatisticsForPeriod(period = 'm1', limit = 5, skip = 0) {
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(`${config.performers.top}/${period}?limit=${limit}&skip=${skip}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }

  getUserStatistics(userName) {
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(`${config.performers.userStatistics}/${userName}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }

  getInstrumentStatistics(authorPermlink) {
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(`${config.performers.instrumentStatistic}/${authorPermlink}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }

  getMostProfitableUsers(chartId) {
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(`${config.performers.instrumentPerformers}/${chartId}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
}
