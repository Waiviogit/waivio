import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import { getAuthenticatedUserName, getIsAuthenticated, getIsLoaded } from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { addNewNotification } from '../app/appActions';
import { getFollowing } from '../user/userActions';
import { BUSY_API_TYPES } from '../../common/constants/notifications';

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

export const login = () => (dispatch, getState, { steemConnectAPI, waivioAPI }) => {
  const state = getState();

  let promise = Promise.resolve(null);

  if (getIsLoaded(state)) {
    promise = Promise.resolve(null);
  } else if (!steemConnectAPI.options.accessToken) {
    promise = Promise.reject(new Error('There is not accessToken present'));
  } else {
    promise = new Promise(async (resolve, reject) => {
      try {
        const scUserData = await steemConnectAPI.me();
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(scUserData.name);
        resolve({ ...scUserData, userMetaData });
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
      promise: steemConnectAPI.me(),
    },
  });

export const logout = () => (dispatch, getState, { steemConnectAPI }) => {
  steemConnectAPI.revokeToken();
  Cookie.remove('access_token');

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
