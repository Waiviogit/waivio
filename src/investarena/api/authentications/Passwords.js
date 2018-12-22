import Base from '../Base';
import config from '../../configApi/config';

export default class Passwords extends Base {
  resetPassword(data) {
    return this.apiClient.post(config.authentication.password, data);
  }
  changePassword(data, location) {
    return this.apiClient.put(`${config.authentication.password}${location}`, data);
  }
}
