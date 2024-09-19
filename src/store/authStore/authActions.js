import Cookie from 'js-cookie';
import { get } from 'lodash';
import { message } from 'antd';
import { createAction } from 'redux-actions';
import { makeHiveAuthHeader } from '../../client/HiveAuth/hive-auth-wrapper';
import { getAccount } from '../../common/helpers/apiHelpers';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { loadLanguage } from '../../common/translations';
import {
  addNewNotification,
  changeAdminStatus,
  getCurrentCurrencyRate,
  setUsedLocale,
} from '../appStore/appActions';
import { getWebsiteLanguage } from '../appStore/appSelectors';
import { getFollowing } from '../userStore/userActions';
import { BUSY_API_TYPES } from '../../common/constants/notifications';
import { setToken } from '../../common/helpers/getToken';
import {
  getGuestPaymentsHistory,
  getPrivateEmail,
  getRewardTab,
  getUserAccount,
  updateGuestProfile,
  waivioAPI,
} from '../../waivioApi/ApiClient';
import { notify } from '../../client/app/Notification/notificationActions';
import history from '../../client/history';
import { clearGuestAuthData, getGuestAccessToken } from '../../common/helpers/localStorageHelpers';
import {
  getAuthenticatedUserMetaData,
  getAuthenticatedUserName,
  getIsAuthenticated,
  getIsLoaded,
  isGuestUser,
  getUserAccountsAuth,
  getAuthenticatedUser,
} from './authSelectors';
import { parseJSON } from '../../common/helpers/parseJSON';
import { getGuestWaivBalance } from '../../waivioApi/walletApi';
import { subscribeTypes } from '../../common/constants/blockTypes';
import { getGuestImportStatus, setGuestImportStatus } from '../../waivioApi/importApi';

export const LOGIN = '@auth/LOGIN';
export const SHOW_SETTINGS = '@auth/SHOW_SETTINGS';
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
export const SET_SIGNATURE = '@auth/SET_SIGNATURE';

export const CHANGE_SORTING_FOLLOW = '@auth/CHANGE_SORTING';

export const BUSY_LOGIN = createAsyncActionType('@auth/BUSY_LOGIN');

export const UPDATE_GUEST_BALANCE = createAsyncActionType('@auth/UPDATE_GUEST_BALANCE');
export const UPDATE_GUEST_AUTHORITY = '@auth/UPDATE_GUEST_AUTHORITY';

export const SET_TAB_REWARDS = createAsyncActionType('@auth/SET_TAB_REWARDS');

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

export const logout = () => (dispatch, getState, { busyAPI, steemConnectAPI }) => {
  const state = getState();
  let accessToken = Cookie.get('access_token');
  const hiveAuth = Cookie.get('auth');
  const language = getWebsiteLanguage(state);

  if (state.auth.isGuestUser) {
    accessToken = getGuestAccessToken();
    clearGuestAuthData();
    if (window) {
      if (window.FB) {
        window.FB.getLoginStatus(res => {
          if (res.status === 'connected') window.FB.logout();
        });
      }

      if (typeof window !== 'undefined' && window.gapi && window.gapi.auth2) {
        const authInstance = window.gapi.auth2.getAuthInstance();

        if (authInstance.isSignedIn && authInstance.isSignedIn.get()) authInstance.signOut();
      }
    }
  } else if (hiveAuth) {
    Cookie.remove('access_token');
    Cookie.remove('auth');
  } else {
    steemConnectAPI.revokeToken();
    Cookie.remove('access_token');
  }
  busyAPI.instance.sendAsync('unsubscribe', [accessToken]);
  history.push('/');

  dispatch({
    type: LOGOUT,
    meta: language,
  });
};

export const login = (accessToken = '', socialNetwork = '', regData = '') => async (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  let promise = Promise.resolve(null);
  const guestAccessToken = getGuestAccessToken();
  const isGuest = Boolean(guestAccessToken);
  let hiveAuthData = parseJSON(Cookie.get('auth'));

  if (socialNetwork === 'hiveAuth') {
    hiveAuthData = parseJSON(regData);
    Cookie.set('auth', hiveAuthData);
    makeHiveAuthHeader(hiveAuthData);
  }

  if (hiveAuthData) {
    if (hiveAuthData.expire < Date.now()) {
      Cookie.remove('auth');
      Cookie.remove('access_token');
    } else {
      promise = new Promise(async resolve => {
        const account = await getAccount(hiveAuthData.username);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(hiveAuthData.username);
        const privateEmail = await getPrivateEmail(hiveAuthData.username);
        const rewardsTab = await getRewardTab(hiveAuthData.username);

        dispatch(changeAdminStatus(hiveAuthData.username));
        dispatch(setSignature(userMetaData?.profile?.signature || ''));
        dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));
        dispatch(setUsedLocale(await loadLanguage(userMetaData.settings.locale)));

        resolve({
          account,
          ...rewardsTab,
          userMetaData,
          privateEmail,
        });
      });
    }
  } else if (isUserLoaded(state)) {
    const userMetaData = getAuthenticatedUserMetaData(state);
    const authenticatedUserName = getAuthenticatedUserName(state);

    dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));
    dispatch(changeAdminStatus(authenticatedUserName));
    promise = Promise.resolve(null);
  } else if (accessToken && socialNetwork) {
    promise = new Promise(async (resolve, reject) => {
      try {
        const userData = await setToken(accessToken, socialNetwork, regData);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(userData.name);
        const privateEmail = await getPrivateEmail(userData.name);
        const rewardsTab = await getRewardTab(userData.name);
        const { WAIV } = await getGuestWaivBalance(userData.name);

        dispatch(setUsedLocale(await loadLanguage(userMetaData.settings.locale)));
        dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));
        dispatch(changeAdminStatus(userData.name));

        resolve({
          account: userData,
          userMetaData,
          privateEmail,
          socialNetwork,
          isGuestUser: true,
          waivBalance: WAIV,
          ...rewardsTab,
        });
      } catch (e) {
        dispatch(notify(e.error.details[0].message));
        reject(e);
      }
    });
  } else if (!steemConnectAPI.accessToken && !isGuest) {
    promise = Promise.reject();
  } else if (isGuest || steemConnectAPI.accessToken) {
    promise = new Promise(async resolve => {
      try {
        const scUserData = await steemConnectAPI.me();
        const account = isGuest ? scUserData?.account : await getAccount(scUserData.name);
        const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(scUserData.name);
        const privateEmail = await getPrivateEmail(scUserData.name);
        const rewardsTab = await getRewardTab(scUserData.name);
        const { WAIV } = isGuest ? await getGuestWaivBalance(scUserData.name) : {};

        dispatch(changeAdminStatus(scUserData.name));
        dispatch(setSignature(scUserData?.user_metadata?.profile?.signature || ''));
        dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));
        dispatch(setUsedLocale(await loadLanguage(userMetaData.settings.locale)));

        resolve({
          ...scUserData,
          ...rewardsTab,
          account,
          userMetaData,
          privateEmail,
          waivBalance: WAIV,
          isGuestUser: isGuest,
        });
      } catch (e) {
        if (e) message.error('Authorization was not successful. Please try again later.');
        clearGuestAuthData();
        Cookie.remove('auth');
      }
    });
  }

  // if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'login');

  return dispatch({
    type: LOGIN,
    payload: {
      promise,
    },
    meta: {
      refresh: isUserLoaded(state),
    },
  })
    .then(() => dispatch({ type: SHOW_SETTINGS }))
    .catch(e => {
      dispatch(loginError());

      return e;
    });
};

// eslint-disable-next-line consistent-return
export const loginFromServer = cookie => (dispatch, getState, { steemConnectAPI }) => {
  let promise = Promise.resolve(null);
  const isGuest = Boolean(cookie.guestName);
  const hiveAuthData = parseJSON(cookie.auth);

  try {
    if (hiveAuthData) {
      if (hiveAuthData.expire < Date.now()) {
        Promise.resolve();
      } else {
        promise = new Promise(async resolve => {
          const account = await getUserAccount(hiveAuthData.username);
          const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(hiveAuthData.username);
          const privateEmail = await getPrivateEmail(hiveAuthData.username);
          const rewardsTab = await getRewardTab(hiveAuthData.username);

          dispatch(changeAdminStatus(hiveAuthData.username));
          dispatch(setSignature(userMetaData?.profile?.signature || ''));
          dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));

          resolve({
            account,
            ...rewardsTab,
            userMetaData,
            privateEmail,
          });
        });
      }
    } else if (cookie.access_token && cookie.socialProvider) {
      promise = new Promise(async (resolve, reject) => {
        try {
          const userData = await setToken(cookie.access_token, cookie.socialProvider);
          const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(userData.name);
          const privateEmail = await getPrivateEmail(userData.name);
          const rewardsTab = await getRewardTab(userData.name);
          const { WAIV } = await getGuestWaivBalance(userData.name);

          dispatch(setUsedLocale(await loadLanguage(userMetaData.settings.locale)));
          dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));
          dispatch(changeAdminStatus(userData.name));

          resolve({
            account: userData,
            userMetaData,
            privateEmail,
            socialNetwork: cookie.socialProvider,
            isGuestUser: true,
            waivBalance: WAIV,
            ...rewardsTab,
          });
        } catch (e) {
          dispatch(notify(e.error.details[0].message));
          reject(e);
        }
      });
    } else if (isGuest || cookie.access_token) {
      promise = new Promise(async resolve => {
        try {
          const scUserData = isGuest
            ? await waivioAPI.getUserAccount(cookie.guestName, true)
            : await steemConnectAPI.me();
          const account = isGuest ? scUserData : await getUserAccount(scUserData.name);
          const userMetaData = await waivioAPI.getAuthenticatedUserMetadata(scUserData.name);
          const privateEmail = await getPrivateEmail(scUserData.name);
          const rewardsTab = await getRewardTab(scUserData.name);
          const { WAIV } = isGuest ? await getGuestWaivBalance(scUserData.name) : {};

          dispatch(changeAdminStatus(scUserData.name));
          dispatch(setSignature(scUserData?.user_metadata?.profile?.signature || ''));
          dispatch(getCurrentCurrencyRate(userMetaData.settings.currency));

          resolve({
            ...scUserData,
            ...rewardsTab,
            account,
            userMetaData,
            privateEmail,
            waivBalance: WAIV,
            isGuestUser: isGuest,
          });
        } catch (e) {
          console.warn(e);
        }
      });
    }

    return dispatch({
      type: LOGIN,
      payload: {
        promise,
      },
    }).catch(e => e);
  } catch (e) {
    console.warn(e);
  }

  // if (typeof window !== 'undefined' && window.gtag) window.gtag('event', 'login');
};

export const getCurrentUserFollowing = () => dispatch => dispatch(getFollowing());

export const reload = () => (dispatch, getState, { steemConnectAPI }) =>
  dispatch({
    type: RELOAD,
    payload: {
      promise: steemConnectAPI.me(getAuthenticatedUserName(getState())),
    },
  });

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

  if (Cookie.get('auth')) {
    method = 'hive_auth_login';
  }

  if (!getIsAuthenticated(state)) {
    return dispatch({ type: BUSY_LOGIN.ERROR });
  }

  busyAPI.instance.subscribe((response, mess) => {
    const type = mess && mess.type;

    if (type === BUSY_API_TYPES.notification && mess.notification) {
      dispatch(addNewNotification(mess.notification));
    }
  });

  const targetUsername = getAuthenticatedUserName(state);

  return dispatch({
    type: BUSY_LOGIN.ACTION,
    meta: targetUsername,
    payload: {
      promise: busyAPI.instance.sendAsync(method, [accessToken]),
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

export const changeRewardsTab = () => (dispatch, getState) =>
  dispatch({
    type: SET_TAB_REWARDS.ACTION,
    payload: getRewardTab(getAuthenticatedUserName(getState())).then(res => res),
  });

export const updateProfile = (username, values) => (dispatch, getState) => {
  const state = getState();
  // eslint-disable-next-line camelcase
  const json_metadata = parseJSON(get(state, ['auth', 'user', 'posting_json_metadata']));

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

export const setSignature = signature => dispatch =>
  dispatch({
    type: SET_SIGNATURE,
    payload: signature,
  });

export const updateAuthProfile = (userName, profileDate, his, intl) => (
  dispatch,
  getState,
  { steemConnectAPI, busyAPI },
) => {
  const metadata = JSON.parse(profileDate?.[1]?.posting_json_metadata);
  const signature = metadata?.profile?.signature;

  dispatch(setSignature(signature));
  steemConnectAPI
    .broadcast([profileDate])
    .then(res => {
      busyAPI.instance.sendAsync(subscribeTypes.subscribeTransactionId, [userName, res.result.id]);
      busyAPI.instance.subscribe((response, mess) => {
        if (mess?.success && mess?.permlink === res.result.id) {
          his.push(`/@${userName}`);

          message.success(
            intl.formatMessage({
              id: 'profile_updated',
              defaultMessage: 'Profile updated',
            }),
          );
        }
      });
    })
    .catch(e => {
      this.setState({ isLoading: false });
      message.error(e.message);
    });
};

export const UPDATE_AUTHORITY = '@auth/UPDATE_AUTHORITY';

export const getGuestAuthorityStatus = username => dispatch =>
  getGuestImportStatus(username).then(res => {
    if (!res.error) {
      try {
        dispatch({ type: UPDATE_GUEST_AUTHORITY, payload: res });
      } catch (e) {
        console.error(e);
      }
    }
  });

export const toggleBots = (bot, isAuthority) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const user = getAuthenticatedUser(state);
  const bots = getUserAccountsAuth(state);
  const account_auths = isAuthority
    ? bots.filter(i => i[0] !== bot)
    : [...bots, [bot, 1]].sort((a, b) => {
        if (a[0] < b[0]) {
          return -1;
        }
        if (a[0] > b[0]) {
          return 1;
        }

        return 0;
      });

  const isGuest = isGuestUser(state);
  const method = () =>
    isGuest
      ? setGuestImportStatus(user.name, !isAuthority).then(res => {
          if (!res.error) {
            try {
              dispatch({ type: UPDATE_GUEST_AUTHORITY, payload: res });
            } catch (e) {
              console.error(e);
            }
          }
        })
      : steemConnectAPI
          .broadcast(
            [
              [
                'account_update',
                {
                  account: user.name,
                  posting: {
                    weight_threshold: 1,
                    account_auths,
                    key_auths: user.posting.key_auths,
                  },
                  memo_key: user.memo_key,
                  json_metadata: user.json_metadata,
                },
              ],
            ],
            null,
            'active',
          )
          .then(res => {
            if (!res.error && !isGuest)
              dispatch({ type: UPDATE_AUTHORITY, payload: account_auths });
          });

  return method();
};
