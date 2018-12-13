import { createAction } from 'redux-actions';
import { getIsAuthenticated, getAuthenticatedUserName } from '../reducers';
import { getAllFollowing } from '../helpers/apiHelpers';
import { createAsyncActionType } from '../helpers/stateHelpers';

export const FOLLOW_WOBJECT = '@wobj/FOLLOW_WOBJECT';
export const FOLLOW_WOBJECT_START = '@wobj/FOLLOW_WOBJECT_START';
export const FOLLOW_WOBJECT_SUCCESS = '@wobj/FOLLOW_WOBJECT_SUCCESS';
export const FOLLOW_WOBJECT_ERROR = '@wobj/FOLLOW_WOBJECT_ERROR';

export const followObject = authorPermlink => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_WOBJECT,
    payload: {
      promise: steemConnectAPI.followObject(getAuthenticatedUserName(state), authorPermlink),
    },
    meta: {
      authorPermlink,
    },
  });
};

export const UNFOLLOW_WOBJECT = '@wobj/UNFOLLOW_WOBJECT';
export const UNFOLLOW_WOBJECT_START = '@wobj/UNFOLLOW_WOBJECT_START';
export const UNFOLLOW_WOBJECT_SUCCESS = '@wobj/UNFOLLOW_WOBJECT_SUCCESS';
export const UNFOLLOW_WOBJECT_ERROR = '@wobj/UNFOLLOW_WOBJECT_ERROR';

export const unfollowObject = authorPermlink => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: UNFOLLOW_WOBJECT,
    payload: {
      promise: steemConnectAPI.unfollowObject(getAuthenticatedUserName(state), authorPermlink),
    },
    meta: {
      authorPermlink,
    },
  });
};

export const GET_FOLLOWING = '@wobj/GET_FOLLOWING';
export const GET_FOLLOWING_START = '@wobj/GET_FOLLOWING_START';
export const GET_FOLLOWING_SUCCESS = '@wobj/GET_FOLLOWING_SUCCESS';
export const GET_FOLLOWING_ERROR = '@wobj/GET_FOLLOWING_ERROR';

export const getFollowing = username => (dispatch, getState) => {
  const state = getState();

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_FOLLOWING_ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);

  return dispatch({
    type: GET_FOLLOWING,
    meta: targetUsername,
    payload: {
      promise: getAllFollowing(targetUsername),
    },
  });
};

export const UPDATE_RECOMMENDATIONS = '@wobj/UPDATE_RECOMMENDATIONS';
export const updateRecommendations = createAction(UPDATE_RECOMMENDATIONS);

export const GET_NOTIFICATIONS = createAsyncActionType('@wobj/GET_NOTIFICATIONS');

export const getNotifications = username => (dispatch, getState, { busyAPI }) => {
  const state = getState();

  if (!username && !getIsAuthenticated(state)) {
    return dispatch({ type: GET_NOTIFICATIONS.ERROR });
  }

  const targetUsername = username || getAuthenticatedUserName(state);

  return dispatch({
    type: GET_NOTIFICATIONS.ACTION,
    meta: targetUsername,
    payload: {
      promise: busyAPI.sendAsync('get_notifications', [targetUsername]),
    },
  });
};

export const LIKE_OBJECT = '@wobj/LIKE_OBJECT';

export const voteObject = (objCreator, objPermlink, weight = 10000) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }

  const voter = auth.user.name;

  return dispatch({
    type: LIKE_OBJECT,
    payload: {
      promise: steemConnectAPI.vote(voter, objCreator, objPermlink, weight),
    },
  });
};
