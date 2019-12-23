import { getAccessToken, getNewToken } from '../../waivioApi/ApiClient';

export const setToken = async (socialToken, social, regData) => {
  const userData = await getAccessToken(socialToken, social, regData);
  localStorage.setItem('accessToken', userData.token);
  const expiration = userData.expiration;
  localStorage.setItem('accessTokenExpiration', String(expiration));
  localStorage.setItem('socialName', social);
  localStorage.setItem('guestName', userData.userData.name);
  return userData;
};

// eslint-disable-next-line no-unused-vars
export const getValidTokenData = async () => {
  const token = localStorage.getItem('accessToken');
  const expiration = localStorage.getItem('accessTokenExpiration');
  if (expiration && Date.now() > expiration * 1000) {
    const userData = await getNewToken(token);
    if (userData.status === 200) {
      localStorage.setItem('accessToken', userData.token);
      localStorage.setItem('accessTokenExpiration', String(userData.expiration));
      localStorage.setItem('guestName', userData.userData.name);
      return userData;
    }
  }
  const name = localStorage.getItem('guestName');
  return { token: null, userData: { name } };
};
