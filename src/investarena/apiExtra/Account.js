import axios from 'axios';
import { invArena } from '../configApi/apiResources';

class Account {
  logonWithToken(token) {
    return axios({
      method: 'POST',
      url: `${invArena.logonWithToken}${token}`,
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
