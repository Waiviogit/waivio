import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName, getIsAuthenticated, getUser } from '../reducers';

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

export const getUserAccount = name => (dispatch, getState) => {
  const state = getState();
  const authUser = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: ApiClient.getUserAccount(name, false, authUser),
    meta: { username: name },
  });
};

export const GET_RANDOM_EXPERTS = '@users/GET_RANDOM_EXPERTS';
export const GET_RANDOM_EXPERTS_START = '@users/GET_RANDOM_EXPERTS_START';
export const GET_RANDOM_EXPERTS_SUCCESS = '@users/GET_RANDOM_EXPERTS_SUCCESS';
export const GET_RANDOM_EXPERTS_ERROR = '@users/GET_RANDOM_EXPERTS_ERROR';

export const getRandomExperts = () => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());
  dispatch({
    type: GET_RANDOM_EXPERTS,
    payload: ApiClient.getTopUsers(user, { isRandom: true }),
  });
};

export const GET_TOP_EXPERTS = '@users/GET_TOP_EXPERTS';
export const GET_TOP_EXPERTS_START = '@users/GET_TOP_EXPERTS_START';
export const GET_TOP_EXPERTS_SUCCESS = '@users/GET_TOP_EXPERTS_SUCCESS';
export const GET_TOP_EXPERTS_ERROR = '@users/GET_TOP_EXPERTS_ERROR';

export const getTopExperts = (limit = 20, skip = 0) => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_TOP_EXPERTS,
    payload: ApiClient.getTopUsers(user, { limit, skip }),
    meta: { limit },
  });
};

export const GET_USER_METADATA = createAsyncActionType('@users/GET_USER_METADATA');

export const getUserMetadata = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  if (userName) {
    return dispatch({
      type: GET_USER_METADATA.ACTION,
      payload: ApiClient.getAuthenticatedUserMetadata(userName),
    });
  }
  return dispatch({ type: GET_USER_METADATA.ERROR, payload: Promise.resolve(null) });
};

export const UNFOLLOW_USER = createAsyncActionType('@users/UNFOLLOW_USER');

export const unfollowUser = (username, top = false) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  const authUser = getAuthenticatedUserName(state);

  return dispatch({
    type: UNFOLLOW_USER.ACTION,
    payload: {
      promise: steemConnectAPI.unfollow(authUser, username),
    },
    meta: {
      username,
      top,
    },
  });
};
export const FOLLOW_USER = createAsyncActionType('@user/FOLLOW_USER');

export const followUser = (username, top = false) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  const authUser = getAuthenticatedUserName(state);

  return dispatch({
    type: FOLLOW_USER.ACTION,
    payload: {
      promise: steemConnectAPI.follow(authUser, username),
    },
    meta: {
      username,
      top,
    },
  });
};

export const GET_USER_PRIVATE_EMAIL = createAsyncActionType('@user/GET_USER_PRIVATE_EMAIL');

export const getUserPrivateEmail = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);

  if (userName) {
    return dispatch({
      type: GET_USER_PRIVATE_EMAIL.ACTION,
      payload: ApiClient.getPrivateEmail(userName),
    });
  }
  return dispatch({ type: GET_USER_PRIVATE_EMAIL.ERROR, payload: Promise.resolve(null) });
};

export const CHANGE_COUNTER = '@users/CHANGE_COUNTER';

export const changeCounterFollow = (username, type, follow = false) => (dispatch, getState) => {
  const state = getState();
  const user = getUser(state, username);
  const authUserName = getAuthenticatedUserName(state);

  if (authUserName !== username) return null;

  const key = type === 'user' ? 'users_following_count' : 'objects_following_count';
  const counter = follow ? user[key] + 1 : user[key] - 1;

  return dispatch({
    type: CHANGE_COUNTER,
    payload: {
      counter,
      username,
      key,
    },
  });
};

export const UPDATE_USER_METADATA = '@auth/UPDATE_USER_METADATA';

export const updateUserMetadata = metadata => dispatch =>
  dispatch({
    type: UPDATE_USER_METADATA,
    payload: metadata,
  });
