import { getAccessToken, getNewToken } from '../../waivioApi/ApiClient';

let userData = {};

export const setToken = async (socialToken, social) => {
  userData = await getAccessToken(socialToken, social);
  localStorage.setItem('accessToken', userData.token);
  const expiration = userData.expiration * 1000;
  localStorage.setItem('accessTokenExpiration', String(expiration));
  localStorage.setItem('socialName', social);
};

export const getValidTokenData = async () => {
  let expiration = localStorage.getItem('accessTokenExpiration');
  if (expiration && Date.now() > expiration) {
    const token = localStorage.getItem('accessToken');
    const res = await getNewToken(token);
    localStorage.setItem('accessToken', res.token);
    expiration = res.expiration * 1000;
    localStorage.setItem('accessTokenExpiration', String(expiration));
    userData = res;
  }
  return userData;
};
