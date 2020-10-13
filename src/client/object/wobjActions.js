import { createAction } from 'redux-actions';
import { getAuthenticatedUserName, getIsAuthenticated } from '../reducers';
import { getAllFollowing } from '../helpers/apiHelpers';
import { createAsyncActionType } from '../helpers/stateHelpers';

export const FOLLOW_OBJECT = createAsyncActionType('FOLLOW_OBJECT');

export const followWobject = (permlink, name, type) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: FOLLOW_OBJECT.ACTION,
    payload: {
      promise: steemConnectAPI.followObject(getAuthenticatedUserName(state), permlink, name, type),
    },
    meta: {
      permlink,
    },
  });
};

export const UNFOLLOW_OBJECT = createAsyncActionType('UNFOLLOW_OBJECT');

export const unfollowWobject = (permlink, name, type) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  console.log("perm", permlink, name, type)

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  return dispatch({
    type: UNFOLLOW_OBJECT.ACTION,
    payload: {
      promise: steemConnectAPI.unfollowObject(
        getAuthenticatedUserName(state),
        permlink,
        name,
        type,
      ),
    },
    meta: {
      permlink,
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
      promise: getAllFollowing(targetUsername, state.auth.isGuestUser),
    },
  });
};

export const UPDATE_RECOMMENDATIONS = '@wobj/UPDATE_RECOMMENDATIONS';
export const updateRecommendations = createAction(UPDATE_RECOMMENDATIONS);

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

export const RATE_WOBJECT = '@wobj/RATE_WOBJECT';
export const RATE_WOBJECT_START = '@wobj/RATE_WOBJECT_START';
export const RATE_WOBJECT_ERROR = '@wobj/RATE_WOBJECT_ERROR';
export const RATE_WOBJECT_SUCCESS = '@wobj/RATE_WOBJECT_SUCCESS';

export const rateObject = (author, permlink, authorPermlink, rate) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();

  if (!getIsAuthenticated(state)) {
    return Promise.reject('User is not authenticated');
  }

  const username = getAuthenticatedUserName(state);

  return dispatch({
    type: RATE_WOBJECT,
    payload: {
      promise: steemConnectAPI.rankingObject(username, author, permlink, authorPermlink, rate),
    },
    meta: {
      voter: username,
      permlink,
      rate,
    },
  });
};
