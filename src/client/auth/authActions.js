import Cookie from 'js-cookie';
import { createAction } from 'redux-actions';
import { push } from 'connected-react-router';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsLoaded,
  isGuestUser,
} from '../reducers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { addNewNotification } from '../app/appActions';
import { getFollowing, getNotifications } from '../user/userActions';
import { BUSY_API_TYPES } from '../../common/constants/notifications';
import {
  disconnectBroker,
  initBrokerConnection,
} from '../../investarena/redux/actions/brokersActions';
import { setToken } from '../helpers/getToken';
import { getGuestPaymentsHistory, updateGuestProfile } from '../../waivioApi/ApiClient';
import { notify } from '../app/Notification/notificationActions';
import { getIsBeaxyUser } from '../user/usersHelper';

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

export const BUSY_LOGIN = createAsyncActionType('@auth/BUSY_LOGIN');

export const UPDATE_GUEST_BALANCE = createAsyncActionType('@auth/UPDATE_GUEST_BALANCE');

const loginError = createAction(LOGIN_ERROR);

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

export const logoutWithoutBroker = () => (dispatch, getState, { steemConnectAPI, waivioAPI }) => {
  const isAuthenticated = getIsAuthenticated(getState());
  if (!isAuthenticated) return;
  if (waivioAPI.isGuest) {
    waivioAPI.clearGuestData();
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-unused-expressions
      window.FB && window.FB.logout();
      // eslint-disable-next-line no-unused-expressions
      window.gapi && window.gapi.auth2.getAuthInstance().signOut();
    }
  } else if (steemConnectAPI.options.accessToken) {
    steemConnectAPI.revokeToken();
    steemConnectAPI.removeAccessToken();
    Cookie.remove('access_token');
  }
  dispatch({
    type: LOGOUT,
  });
  dispatch(push('/'));
};

export const logout = () => (dispatch, getState, { busyAPI }) => {
  let accessToken = Cookie.get('access_token');
  const guestAccessToken = Cookie.get('waivio_token');
  if (guestAccessToken) accessToken = guestAccessToken;
  busyAPI.sendAsync('unsubscribe', [accessToken]);
  dispatch(logoutWithoutBroker());
  dispatch(disconnectBroker());
};

export const beaxyLogin = (userData, bxySessionData) => (dispatch, getState, { waivioAPI }) => {
  const state = getState();

  return dispatch({
    type: LOGIN,
    payload: new Promise(async (resolve, reject) => {
      try {
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(userData.user.name);
        waivioAPI.saveGuestData(
          userData.token,
          userData.expiration,
          userData.user.name,
          'beaxy',
          bxySessionData,
          () => dispatch(initBrokerConnection({ platform: 'beaxy', isBeaxyAuth: true })),
        );
        dispatch(getNotifications(userData.user.name));
        resolve({
          account: userData.user,
          userMetaData,
          socialNetwork: 'beaxy',
          isGuestUser: true,
        });
      } catch (e) {
        dispatch(notify(e.error.details[0].message));
        reject(e);
      }
    }),
    meta: {
      refresh: getIsLoaded(state),
    },
  }).catch(e => {
    console.warn(e);
    dispatch(loginError());
    return e;
  });
};

export const login = (oAuthToken = '', socialNetwork = '', regData = '') => async (
  dispatch,
  getState,
  { steemConnectAPI, waivioAPI },
) => {
  if (socialNetwork === 'beaxy')
    return dispatch(beaxyLogin(regData.userData, regData.bxySessionData));
  const state = getState();

  let promise = Promise.resolve(null);

  const isGuest = waivioAPI.isGuest;

  if (getIsLoaded(state)) {
    promise = Promise.resolve(null);
  } else if (oAuthToken && socialNetwork) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const tokenData = await setToken(oAuthToken, socialNetwork, regData);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(tokenData.userData.name);
        resolve({
          account: tokenData.userData,
          userMetaData,
          socialNetwork,
          isGuestUser: true,
        });
        dispatch(getNotifications(tokenData.userData.name));
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
        if (!scUserData) dispatch(logout());
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(scUserData.name);
        if (isGuest && getIsBeaxyUser(scUserData.account)) {
          waivioAPI.guestAuthProvider = scUserData.account.provider; // eslint-disable-line
        }
        resolve({ ...scUserData, userMetaData, isGuestUser: isGuest });
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
    return e;
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

export const busyLogin = () => (dispatch, getState, { busyAPI }) => {
  let accessToken = Cookie.get('access_token');
  let method = 'login';
  const state = getState();

  const guestAccessToken = Cookie.get('waivio_token');
  if (guestAccessToken) {
    method = 'guest_login';
    accessToken = guestAccessToken;
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

  const targetUser = getAuthenticatedUser(state);

  return dispatch({
    type: BUSY_LOGIN.ACTION,
    meta: targetUser.name,
    payload: {
      promise: busyAPI.sendAsync(method, [accessToken]),
    },
  });
};

export const updateProfile = (username, values) => (dispatch, getState) => {
  const state = getState();
  const jsonMetadata = JSON.parse(state.auth.user.posting_json_metadata);
  jsonMetadata.profile = { ...jsonMetadata.profile, ...values };
  return dispatch({
    type: UPDATE_PROFILE,
    payload: {
      promise: updateGuestProfile(username, jsonMetadata).then(data => {
        if (data.statuscode === 200) {
          return { isProfileUpdated: false };
        }

        return { isProfileUpdated: true };
      }),
    },
    meta: JSON.stringify(jsonMetadata),
  });
};
