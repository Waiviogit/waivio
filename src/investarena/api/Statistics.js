import Base from './Base';
import config from '../configApi/config';
import { isEmpty } from 'lodash';

export default class Statistics extends Base {
  getUserStatistics(userName) {
    return this.apiClient
      .get(`${config.statistics.getUserStatistics}${userName}`, {}, {})
      .then(response => response);
  }
  getUserInstrumentStatistics(userName, sortOptions) {
    return this.apiClient
      .get(
        `${config.statistics.getUserInstrumentStatistics}${userName}?limit=200${
          !isEmpty(sortOptions)
            ? `&sortBy=${sortOptions.sortBy}&sortDirection=${sortOptions.sortDirection}`
            : ''
        }`,
        {},
        {},
      )
      .then(response => response);
  }
}
