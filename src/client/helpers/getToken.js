import store from 'store';
import { getAccessToken, getNewToken } from '../../waivioApi/ApiClient';
import { saveGuestData } from './localStorageHelpers';

export const setToken = async (socialToken, social, regData) => {
  try {
    const userData = await getAccessToken(socialToken, social, regData);
    const expiration = userData.expiration;
    store.set('socialName', social);
    saveGuestData({
      token: userData.token,
      expiration: String(expiration),
      guestName: userData.userData.name,
    });
    return userData;
  } catch (err) {
    return err;
  }
};

// eslint-disable-next-line no-unused-vars
export const getValidTokenData = async () => {
  const token = store.get('accessToken');
  const expiration = store.get('accessTokenExpiration');
  if (expiration && Date.now() > expiration * 1000) {
    const userData = await getNewToken(token);
    if (userData.status === 200) {
      store.set('accessToken', userData.token);
      store.set('accessTokenExpiration', String(userData.expiration));
      store.set('guestName', userData.userData.name);
      return userData;
    }
  }
  const name = store.get('guestName');
  return { token, userData: { name } };
};
