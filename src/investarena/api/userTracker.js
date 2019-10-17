// Functional for user tracking after mailing
import Base from './Base';
import config from '../configApi/config';

export default class UserTracker extends Base {
  setTempUserId(id) {
    localStorage.setItem('tempUserId', id);
    const postData = { email: id, followed: true };
    return this.apiClient
      .post(config.promoCampaign.promo, postData)
      .then(response => ({ status: response.status, error: response.error }));
  }

  sendUserSignUpPlace(id, key) {
    const postData = { email: id, registered_by: key } ;
    return this.apiClient
      .post(config.promoCampaign.promo, postData)
      .then(response => ({ status: response.status, error: response.error }));
  }
}
