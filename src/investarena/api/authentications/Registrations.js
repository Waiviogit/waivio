import Base from '../Base';
import config from '../../configApi/config';

export default class Registrations extends Base {
    registration (data) {
        return this.apiClient.post(config.authentication.registration, data, {});
    }
}
