import Cookie from 'js-cookie';
import { get } from 'lodash';
import store from 'store';
import { getAccessToken, getNewToken, waivioAPI } from '../../waivioApi/ApiClient';

export const setToken = async (socialToken, social, regData) => {
  try {
    const userData = await getAccessToken(socialToken, social, regData);
    waivioAPI.saveGuestData(userData.token, userData.expiration, userData.userData.name, social);
    return userData;
  } catch (err) {
    return err;
  }
};

// eslint-disable-next-line no-unused-vars
export const getValidTokenData = async () => {
  const token = waivioAPI.authToken;
  const expiration = store.get('waivioTokenExpiration');
  if (token && (!expiration || Date.now() < Number(expiration))) {
    const userData = await getNewToken(token);
    if (userData.status === 200) {
      waivioAPI.saveGuestData(userData.token, userData.expiration, userData.name, get(userData, ['auth', 'provider']));
      return userData;
    }
  }
  const name = Cookie.get('guestName');
  return { token, userData: { name } };
};
