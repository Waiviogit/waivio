import { createAction } from 'redux-actions';
import { message } from 'antd';
import { get } from 'lodash';

import { getIsAuthenticated, getAuthenticatedUserName, getLocale } from '../reducers';
import { getAllFollowing } from '../helpers/apiHelpers';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getChangedField } from '../../waivioApi/ApiClient';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';

export const FOLLOW_WOBJECT = '@wobj/FOLLOW_WOBJECT';
export const FOLLOW_WOBJECT_START = '@wobj/FOLLOW_WOBJECT_START';
export const FOLLOW_WOBJECT_SUCCESS = '@wobj/FOLLOW_WOBJECT_SUCCESS';
export const FOLLOW_WOBJECT_ERROR = '@wobj/FOLLOW_WOBJECT_ERROR';

export const APPENDS_VOTE = '@wobj/APPENDS_VOTE';

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
      promise: getAllFollowing(targetUsername, state.auth.isGuestUser),
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

export const VOTE_APPEND_START = '@wobj/VOTE_APPEND_START';
export const VOTE_APPEND_SUCCESS = '@wobj/VOTE_APPEND_SUCCESS';
export const VOTE_APPEND_ERROR = '@wobj/VOTE_APPEND_ERROR';
export const SEND_COMMENT_APPEND = '@wobj/SEND_COMMENT_APPEND';

export const sendCommentAppend = (permlink, comment) => dispatch =>
  dispatch({
    type: SEND_COMMENT_APPEND,
    payload: {
      permlink,
      comment,
    },
  });

export const GET_CHANGED_WOBJECT_FIELD = createAsyncActionType('@wobj/GET_CHANGED_WOBJECT_FIELD');
export const getChangedWobjectField = (authorPermlink, fieldName, author, permlink, blockNum) => (
  dispatch,
  getState,
  { busyAPI },
) => {
  const state = getState();
  const locale = getLocale(state);
  const voter = getAuthenticatedUserName(state);

  busyAPI.sendAsync(subscribeMethod, [voter, blockNum, subscribeTypes.votes]);
  busyAPI.subscribe((response, mess) => {
    if (subscribeTypes.votes === mess.type && mess.notification.blockParsed === blockNum) {
      dispatch({
        type: GET_CHANGED_WOBJECT_FIELD.ACTION,
        payload: {
          promise: getChangedField(authorPermlink, fieldName, author, permlink, locale),
        },
      });
    }
  });
};

export const voteAppends = (postId, author, permlink, weight = 10000) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const { auth, object } = getState();
  const wobj = get(object, 'wobject', {});
  const post = wobj.fields.find(field => field.permlink === permlink);
  const voter = auth.user.name;

  if (!auth.isAuthenticated) {
    return null;
  }

  dispatch({
    type: VOTE_APPEND_START,
    payload: {
      post,
      permlink,
      postId,
    },
  });

  return steemConnectAPI
    .vote(voter, post.author_original || author, post.permlink, weight)
    .then(data => data.json())
    .then(res =>
      dispatch(
        getChangedWobjectField(
          wobj.author_permlink,
          post.name,
          post.author,
          post.permlink,
          res.block_num,
        ),
      ),
    )
    .catch(e => {
      message.error(e.error_description);
      dispatch({
        type: VOTE_APPEND_ERROR,
        payload: {
          post,
          postId,
          permlink,
        },
      });
    });
};

export const FOLLOW_OBJECT = createAsyncActionType('FOLLOW_OBJECT');
export const UNFOLLOW_OBJECT = createAsyncActionType('UNFOLLOW_OBJECT');

export const followWobject = (permlink, name, type) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
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

export const unfollowWobject = (permlink, name, type) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();

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
