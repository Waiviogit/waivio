import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import { getAuthenticatedUserName, getIsAuthenticated, getIsLoaded } from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { addNewNotification } from '../app/appActions';
import { getFollowing } from '../user/userActions';
import { BUSY_API_TYPES } from '../../common/constants/notifications';
import { getValidTokenData, setToken } from '../helpers/getToken';

export const LOGIN = '@auth/LOGIN';
export const LOGIN_START = '@auth/LOGIN_START';
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = '@auth/LOGIN_ERROR';

export const RELOAD = '@auth/RELOAD';
export const RELOAD_START = '@auth/RELOAD_START';
export const RELOAD_SUCCESS = '@auth/RELOAD_SUCCESS';
export const RELOAD_ERROR = '@auth/RELOAD_ERROR';

export const LOGOUT = '@auth/LOGOUT';

export const BUSY_LOGIN = createAsyncActionType('@auth/BUSY_LOGIN');

const loginError = createAction(LOGIN_ERROR);

export const login = (accessToken = '', socialNetwork = '') => async (
  dispatch,
  getState,
  { steemConnectAPI, waivioAPI },
) => {
  const state = getState();

  let promise = Promise.resolve(null);

  let token = null;
  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }

  if (getIsLoaded(state)) {
    promise = Promise.resolve(null);
  } else if (accessToken && socialNetwork) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const tokenData = await setToken(accessToken, socialNetwork);
        console.log(tokenData);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(tokenData.userData.name);
        resolve({ account: tokenData.userData, userMetaData, socialNetwork, isGuestUser: true });
      } catch (e) {
        reject(e);
      }
    });
  } else if (!steemConnectAPI.options.accessToken && !token) {
    promise = Promise.reject(new Error('There is not accessToken present'));
  } else if (steemConnectAPI.options.accessToken) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const scUserData = await steemConnectAPI.me();
        console.log(scUserData);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(scUserData.name);
        resolve({ ...scUserData, userMetaData });
      } catch (e) {
        reject(e);
      }
    });
  } else if (token) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const expiration = localStorage.getItem('accessTokenExpiration');
        const socialName = localStorage.getItem('socialName');
        const tokenData = await getValidTokenData(token, expiration);
        console.log(tokenData);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(tokenData.userData.name);
        resolve({ account: tokenData.userData, userMetaData, socialName, isGuestUser: true });
      } catch (e) {
        reject(e);
      }
    });
  }
  return dispatch({
    type: LOGIN,
    payload: {
      promise,
    },
    meta: {
      refresh: getIsLoaded(state),
    },
  }).catch(e => {
    console.warn(e);
    dispatch(loginError());
  });
};

export const getCurrentUserFollowing = () => dispatch => dispatch(getFollowing());

export const reload = () => (dispatch, getState, { steemConnectAPI }) =>
  dispatch({
    type: RELOAD,
    payload: {
      promise: steemConnectAPI.me(getAuthenticatedUserName(getState())),
    },
  });

export const logout = () => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  if (state.auth.isGuestUser) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiration');
    localStorage.removeItem('socialName');
    if (window) {
      // eslint-disable-next-line no-unused-expressions
      window.FB && window.FB.logout();
      // eslint-disable-next-line no-unused-expressions
      window.gapi && window.gapi.auth2.getAuthInstance().signOut();
    }
  } else {
    steemConnectAPI.revokeToken();
    Cookie.remove('access_token');
  }
  dispatch({
    type: LOGOUT,
  });
};

export const busyLogin = () => (dispatch, getState, { busyAPI }) => {
  const accessToken = Cookie.get('access_token');
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return dispatch({ type: BUSY_LOGIN.ERROR });
  }

  busyAPI.subscribe((response, message) => {
    const type = message && message.type;

    if (type === BUSY_API_TYPES.notification && message.notification) {
      dispatch(addNewNotification(message.notification));
    }
  });

  const targetUsername = getAuthenticatedUserName(state);

  return dispatch({
    type: BUSY_LOGIN.ACTION,
    meta: targetUsername,
    payload: {
      promise: busyAPI.sendAsync('login', [accessToken]),
    },
  });
};
