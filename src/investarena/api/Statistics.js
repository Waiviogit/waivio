import Base from './Base';
import config from '../configApi/config';

export default class Statistics extends Base {
  getUserStatistics(userName) {
    return this.apiClient
      .get(`${config.statistics.getUserStatistics}${userName}`, {}, {})
      .then(response => response);
  }
  getUserInstrumentStatistics(userName) {
    return this.apiClient
      .get(`${config.statistics.getUserInstrumentStatistics}${userName}`, {}, {})
      .then(response => response);
  }
}
