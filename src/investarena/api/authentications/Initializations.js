import Base from '../Base';
import config from '../../configApi/config';

export default class Initializations extends Base {
  validateToken(headers) {
    return this.apiClient.validateToken(config.authentication.validateToken, headers);
  }
}
