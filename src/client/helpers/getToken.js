import { getAccessToken, getNewToken } from '../../waivioApi/ApiClient';

export const setToken = async (socialToken, social) => {
  const res = await getAccessToken(socialToken, social);
  localStorage.setItem('accessToken', res.token);
  const expiration = res.expiration * 1000;
  localStorage.setItem('accessTokenExpiration', String(expiration));
  localStorage.setItem('socialName', social);
};

export const getValidTokenData = async () => {
  let token = localStorage.getItem('accessToken');
  let expiration = localStorage.getItem('accessTokenExpiration');
  if (expiration && Date.now() > expiration) {
    const res = await getNewToken(token);
    localStorage.setItem('accessToken', res.token);
    expiration = res.expiration * 1000;
    localStorage.setItem('accessTokenExpiration', String(expiration));
    token = res;
  }
  return token;
};
