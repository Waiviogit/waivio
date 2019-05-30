import Base from './Base';
import config from '../configApi/config';

export default class Performers extends Base {
  searchInstrumentsStat(searchString) {
    return this.apiClient
      .get(`${config.performers.searchInstrumentsStatistic}/${searchString}`)
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

  getInstrumentStatistics(autorPermlink) {
    return new Promise((resolve, reject) => {
      this.apiClient
        .get(`${config.performers.instrumentStatistic}/${autorPermlink}`)
        .then(response => resolve(response.data))
        .catch(error => reject(error));
    });
  }
}
