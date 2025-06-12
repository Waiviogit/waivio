import Cookie from 'js-cookie';
import store from 'store';
import { getAccessToken, refreshToken as refreshTokenRequest } from '../../waivioApi/ApiClient';
import { clearGuestAuthData, getGuestAccessToken, setGuestAuthData } from './localStorageHelpers';

export const setToken = async (socialToken, social, regData) => {
  try {
    const { accessToken, expiration, refreshToken, userData } = await getAccessToken(
      socialToken,
      social,
      regData,
    );

    setGuestAuthData(accessToken, refreshToken, expiration);
    store.set('socialName', social);
    store.set('guestName', userData.name);
    Cookie.set('guestName', userData.name);
    Cookie.set('access_token', accessToken);

    return userData;
  } catch (err) {
    return err;
  }
};

export const setNightMode = isNightMode => {
  if (isNightMode === Cookie.get('nightmode')) return;

  Cookie.remove('nightmode');
  Cookie.set('nightmode', isNightMode);
};

// eslint-disable-next-line no-unused-vars
export const getValidTokenData = async () => {
  const expiration = store.get('accessTokenExpiration');

  if (expiration && Date.now() > expiration * 1000) {
    const refreshTokenValue = store.get('refreshToken');
    const response = await refreshTokenRequest(refreshTokenValue);

    if (response.status === 200) {
      setGuestAuthData(response.accessToken, response.refreshToken, response.expiration);
    }
    if (response.status === 401) {
      clearGuestAuthData();
      if (typeof window !== 'undefined') window.location?.replace(window.location.origin);
    }
  }

  const token = getGuestAccessToken();
  const name = store.get('guestName');

  return { token, userData: { name } };
};
