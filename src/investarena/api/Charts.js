import Base from './Base';
import config from '../configApi/config';

export default class Charts extends Base {
  getChartsData() {
    return this.apiClient.get(config.charts.getChartsData, {}, {}).then(response => {
      if (response.data) {
        return response.data;
      }
    });
  }
}
