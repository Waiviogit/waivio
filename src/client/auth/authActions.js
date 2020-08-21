import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsLoaded,
  isGuestUser,
} from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { addNewNotification } from '../app/appActions';
import { getFollowing } from '../user/userActions';
import { BUSY_API_TYPES } from '../../common/constants/notifications';
import { setToken } from '../helpers/getToken';
import {
  getGuestPaymentsHistory,
  getPrivateEmail,
  updateGuestProfile,
} from '../../waivioApi/ApiClient';
import { notify } from '../app/Notification/notificationActions';
import history from '../history';
import { clearGuestAuthData, getGuestAccessToken } from '../helpers/localStorageHelpers';

export const LOGIN = '@auth/LOGIN';
export const LOGIN_START = '@auth/LOGIN_START';
export const LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS';
export const LOGIN_ERROR = '@auth/LOGIN_ERROR';

export const UPDATE_PROFILE = '@auth/UPDATE_PROFILE';
export const UPDATE_PROFILE_START = '@auth/UPDATE_PROFILE_START';
export const UPDATE_PROFILE_SUCCESS = '@auth/UPDATE_PROFILE_SUCCESS';
export const UPDATE_PROFILE_ERROR = '@auth/UPDATE_PROFILE_ERROR';

export const RELOAD = '@auth/RELOAD';
export const RELOAD_START = '@auth/RELOAD_START';
export const RELOAD_SUCCESS = '@auth/RELOAD_SUCCESS';
export const RELOAD_ERROR = '@auth/RELOAD_ERROR';

export const LOGOUT = '@auth/LOGOUT';

export const CHANGE_SORTING_FOLLOW = '@auth/CHANGE_SORTING';

export const BUSY_LOGIN = createAsyncActionType('@auth/BUSY_LOGIN');

export const UPDATE_GUEST_BALANCE = createAsyncActionType('@auth/UPDATE_GUEST_BALANCE');

const loginError = createAction(LOGIN_ERROR);

const isUserLoaded = state =>
  getIsLoaded(state) && (Cookie.get('access_token') || getGuestAccessToken());

export const getAuthGuestBalance = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);
  if (isGuest) {
    return dispatch({
      type: UPDATE_GUEST_BALANCE.ACTION,
      payload: getGuestPaymentsHistory(userName),
    });
  }
  return dispatch({ type: UPDATE_GUEST_BALANCE.ERROR });
};

export const login = (accessToken = '', socialNetwork = '', regData = '') => async (
  dispatch,
  getState,
  { steemConnectAPI, waivioAPI },
) => {
  const state = getState();
  let promise = Promise.resolve(null);
  let isGuest = null;

  const guestAccessToken = getGuestAccessToken();
  isGuest = Boolean(guestAccessToken);

  if (isUserLoaded(state)) {
    promise = Promise.resolve(null);
  } else if (accessToken && socialNetwork) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const userData = await setToken(accessToken, socialNetwork, regData);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(userData.name);
        const privateEmail = await getPrivateEmail(userData.name);

        resolve({
          account: userData,
          userMetaData,
          privateEmail,
          socialNetwork,
          isGuestUser: true,
        });
      } catch (e) {
        dispatch(notify(e.error.details[0].message));
        reject(e);
      }
    });
  } else if (!steemConnectAPI.options.accessToken && !isGuest) {
    promise = Promise.reject(new Error('There is not accessToken present'));
  } else if (isGuest || steemConnectAPI.options.accessToken) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const scUserData = await steemConnectAPI.me();
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(scUserData.name);
        const privateEmail = await getPrivateEmail(scUserData.name);

        resolve({
          ...scUserData,
          userMetaData,
          privateEmail,
          isGuestUser: isGuest,
        });
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
      refresh: isUserLoaded(state),
    },
  }).catch(e => {
    console.warn(e);
    dispatch(loginError());

    return e;
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

export const logout = () => (dispatch, getState, { busyAPI, steemConnectAPI }) => {
  const state = getState();
  let accessToken = Cookie.get('access_token');

  if (state.auth.isGuestUser) {
    accessToken = getGuestAccessToken();
    clearGuestAuthData();
    if (window) {
      if (window.FB) {
        window.FB.getLoginStatus(res => {
          if (res.status === 'connected') window.FB.logout();
        });
      }

      if (window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();

        if (authInstance.isSignedIn && authInstance.isSignedIn.get()) authInstance.signOut();
      }
    }
  } else {
    steemConnectAPI.revokeToken();
    Cookie.remove('access_token');
  }
  busyAPI.sendAsync('unsubscribe', [accessToken]);
  history.push('/');

  dispatch({
    type: LOGOUT,
  });
};

export const busyLogin = () => (dispatch, getState, { busyAPI }) => {
  let accessToken = Cookie.get('access_token');
  let method = 'login';
  const state = getState();

  if (typeof localStorage !== 'undefined') {
    const guestAccessToken = getGuestAccessToken();

    if (guestAccessToken) {
      method = 'guest_login';
      accessToken = guestAccessToken;
    }
  }

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
      promise: busyAPI.sendAsync(method, [accessToken]),
    },
  });
};

export const changeSorting = sorting => dispatch => {
  dispatch({
    type: CHANGE_SORTING_FOLLOW,
    payload: sorting,
  });
  return Promise.resolve();
};

export const updateProfile = (username, values) => (dispatch, getState) => {
  const state = getState();
  // eslint-disable-next-line camelcase
  const json_metadata = JSON.parse(state.auth.user.posting_json_metadata);

  json_metadata.profile = { ...json_metadata.profile, ...values };

  return dispatch({
    type: UPDATE_PROFILE,
    payload: {
      promise: updateGuestProfile(username, json_metadata).then(data => {
        if (data.statuscode === 200) {
          return { isProfileUpdated: false };
        }

        return { isProfileUpdated: true };
      }),
    },
    meta: JSON.stringify(json_metadata),
  });
};
