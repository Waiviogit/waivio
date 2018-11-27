import axios from 'axios';
import Cookies from 'js-cookie';
import config from '../configApi/config';

class Account {
  logonWithToken(token) {
    return axios({
      method: 'POST',
      url: `${config.logonWithToken[Cookies.get('platformName')]}${token}`,
      withCredentials: true,
      cache: false,
      dataType: 'json',
      crossDomain: true,
      xhrFields: {
        withCredentials: true,
      },
    }).then(
      response => {
        return response;
      },
      xhr => {
        const response = { error: {} };
        response.error.toString = () => `Response from broker: ${xhr.response.data.message}`;
        return response;
      },
    );
  }
}

export default new Account();
