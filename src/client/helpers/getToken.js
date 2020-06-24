import store from 'store';
import { getAccessToken, refreshToken as refreshTokenRequest } from '../../waivioApi/ApiClient';

export const setToken = async (socialToken, social, regData) => {
  try {
    const { accessToken, expiration, refreshToken, userData } = await getAccessToken(
      socialToken,
      social,
      regData,
    );
    store.set('accessToken', accessToken);
    store.set('refreshToken', refreshToken);
    store.set('accessTokenExpiration', expiration);
    store.set('socialName', social);
    store.set('guestName', userData.name);

    return { userData };
  } catch (err) {
    return err;
  }
};

// eslint-disable-next-line no-unused-vars
export const getValidTokenData = async () => {
  const expiration = store.get('accessTokenExpiration');
  if (expiration && Date.now() > expiration * 1000) {
    const refreshTokenValue = store.get('refreshToken');
    const response = await refreshTokenRequest(refreshTokenValue);
    if (response.status === 200) {
      store.set('accessToken', response.accessToken);
      store.set('refreshToken', response.refreshToken);
      store.set('accessTokenExpiration', response.expiration);
    }
    if (response.status === 401) {
      store.remove('accessToken');
      store.remove('refreshToken');
      store.remove('accessTokenExpiration');
      store.remove('socialName');
      store.remove('guestName');
      window.location.replace(window.location.origin);
    }
  }

  const token = store.get('accessToken');
  const name = store.get('guestName');
  return { token, userData: { name } };
};
