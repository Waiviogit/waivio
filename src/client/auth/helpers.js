import Cookie from 'js-cookie';
import { getGuestAccessToken } from '../helpers/localStorageHelpers';

export const getUserDataForWebsocket = () => {
  let accessToken = Cookie.get('access_token');
  let method = 'login';

  if (typeof localStorage !== 'undefined') {
    const guestAccessToken = getGuestAccessToken();

    if (guestAccessToken) {
      method = 'guest_login';
      accessToken = guestAccessToken;
    }
  }

  return {
    accessToken,
    method,
  };
};

export default null;
