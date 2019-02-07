import Cookies from 'js-cookie';
import { currentTime } from '../../helpers/currentTime';

export const UPDATE_COOKIE_CLIENT = 'UPDATE_COOKIE_CLIENT';
export const UPDATE_COOKIE_SERVER = 'UPDATE_COOKIE_SERVER';
export const UPDATE_COOKIE_SERVER_ERROR = 'UPDATE_COOKIE_SERVER_ERROR';

export function updateCookieClient(name, data) {
  Cookies.set(name, data, {
    expires: currentTime.getTime() / 1000 + 14 * 24 * 3600,
    path: '/',
  });
  return { type: UPDATE_COOKIE_CLIENT, payload: name };
}
export function updateCookieServer(res, name, data) {
  if (res) {
    res.cookie(name, data, { maxAge: Date.now() / 1000 + 14 * 24 * 3600 });
    return { type: UPDATE_COOKIE_SERVER, payload: name };
  }
  return { type: UPDATE_COOKIE_SERVER_ERROR };
}

export function deleteCookieClient(name) {
  Cookies.remove(name);
}
