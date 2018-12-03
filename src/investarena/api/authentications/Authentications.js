import Base from '../Base';
import config from '../../configApi/config';

export default class Authentifications extends Base {
    signIn (email, password, ref) {
        return this.apiClient.post(config.authentication.signIn, {email, password, referrer_url: ref});
    }

    signOut () {
        return this.apiClient.delete(config.authentication.signOut);
    }
    keepAlive () {
        return this.apiClient.post(config.authentication.keepAlive, {});
    }
}
