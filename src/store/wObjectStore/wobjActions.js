import { createAction } from 'redux-actions';
import { message } from 'antd';
import { get, isEmpty, size } from 'lodash';

import { getAllFollowing } from '../../client/helpers/apiHelpers';
import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import {
  getAuthorsChildWobjects,
  getChangedField,
  getWobjectsExpertiseWithNewsFilter,
} from '../../waivioApi/ApiClient';
import { subscribeMethod, subscribeTypes } from '../../common/constants/blockTypes';
import { APPEND_WAIVIO_OBJECT } from '../appendStore/appendActions';
import { BELL_USER_NOTIFICATION, followExpert, unfollowExpert } from '../userStore/userActions';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../authStore/authSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import {
  getRelatedObjectsSkip,
  getRelatedObjectsArray,
  getRelatedObjectsHasNext,
  getObject as getObjectState,
} from './wObjectSelectors';
import { getUsedLocale } from '../appStore/appSelectors';

export const FOLLOW_WOBJECT = '@wobj/FOLLOW_WOBJECT';
export const FOLLOW_WOBJECT_START = '@wobj/FOLLOW_WOBJECT_START';
export const FOLLOW_WOBJECT_SUCCESS = '@wobj/FOLLOW_WOBJECT_SUCCESS';
export const FOLLOW_WOBJECT_ERROR = '@wobj/FOLLOW_WOBJECT_ERROR';
export const CLEAR_RELATED_OBJECTS = '@wobj/CLEAR_RELATED_OBJECTS';
export const GET_WOBJECT_EXPERTISE = createAsyncActionType('@wobj/GET_WOBJECT_EXPERTISE');
export const GET_RELATED_WOBJECT = createAsyncActionType('@wobj/GET_RELATED_WOBJECT');
export const FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE = createAsyncActionType(
  '@wobj/FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE',
);

export const APPENDS_VOTE = '@wobj/APPENDS_VOTE';
export const clearRelateObjects = () => ({ type: CLEAR_RELATED_OBJECTS });

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
      promise: busyAPI.instance.sendAsync('get_notifications', [targetUsername]),
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

export const getChangedWobjectField = (
  authorPermlink,
  fieldName,
  author,
  permlink,
  blockNum,
  isNew = false,
) => (dispatch, getState, { busyAPI }) => {
  const state = getState();
  const locale = getLocale(state);
  const voter = getAuthenticatedUserName(state);
  const subscribeCallback = () =>
    dispatch({
      type: GET_CHANGED_WOBJECT_FIELD.ACTION,
      payload: {
        promise: getChangedField(authorPermlink, fieldName, author, permlink, locale).then(res => {
          dispatch({
            type: APPEND_WAIVIO_OBJECT.SUCCESS,
          });

          return res;
        }),
      },
      meta: { isNew },
    });

  // TODO fix no number of last block
  if (blockNum) {
    busyAPI.instance.sendAsync(subscribeMethod, [voter, blockNum, subscribeTypes.votes]);
    busyAPI.instance.subscribeBlock(subscribeTypes.votes, blockNum, subscribeCallback);
  } else {
    setTimeout(() => {
      subscribeCallback();
    }, 8000);
  }
};

export const voteAppends = (
  author,
  permlink,
  weight = 10000,
  name = '',
  isNew = false,
  type = '',
  blockNum,
) => (dispatch, getState, { steemConnectAPI }) => {
  const state = getState();
  const wobj = get(state, ['object', 'wobject'], {});
  const post = wobj.fields.find(field => field.permlink === permlink) || null;
  const voter = getAuthenticatedUserName(state);
  const isGuest = isGuestUser(state);
  const fieldName = name || post.name;
  const currentHieUserMethod = !isEmpty(type) || weight % 5 ? 'appendVote' : 'vote';
  const currentMethod = isGuest ? 'vote' : currentHieUserMethod;

  if (!getIsAuthenticated(state)) return null;

  dispatch({
    type: VOTE_APPEND_START,
    payload: {
      post,
      permlink,
    },
  });

  return steemConnectAPI[currentMethod](voter, author, permlink, weight)
    .then(async data => {
      const res = isGuest ? await data.json() : data.result;

      return dispatch(
        getChangedWobjectField(
          wobj.author_permlink,
          fieldName,
          author,
          permlink,
          res.block_num || blockNum,
          isNew,
        ),
      );
    })
    .catch(e => {
      message.error(e.error_description);

      return dispatch({
        type: VOTE_APPEND_ERROR,
        payload: {
          post,
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

export const SET_CATALOG_BREADCRUMBS = '@wobj/SET_CATALOG_BREADCRUMBS';
export const SET_WOBJECT_NESTED = '@wobj/SET_WOBJECT_NESTED';
export const SET_LOADING_NESTED_WOBJECT = '@wobj/SET_LOADING_NESTED_WOBJECT';
export const SET_LIST_ITEMS = '@wobj/SET_LIST_ITEMS';

export const setCatalogBreadCrumbs = payload => ({
  type: SET_CATALOG_BREADCRUMBS,
  payload,
});

export const setNestedWobject = payload => ({
  type: SET_WOBJECT_NESTED,
  payload,
});

export const setLoadedNestedWobject = payload => ({
  type: SET_LOADING_NESTED_WOBJECT,
  payload,
});

export const setListItems = lists => ({
  type: SET_LIST_ITEMS,
  lists,
});

export const BELL_WOBJECT_NOTIFICATION = createAsyncActionType('@wobj/BELL_WOBJECT_NOTIFICATION');

export const wobjectBellNotification = followingWobj => (
  dispatch,
  getState,
  { steemConnectAPI },
) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const subscribe = !get(state, ['object', 'wobject', 'bell']);

  dispatch({
    type: BELL_WOBJECT_NOTIFICATION.START,
  });
  steemConnectAPI
    .bellNotificationsWobject(username, followingWobj, subscribe)
    .then(() =>
      dispatch({
        type: BELL_WOBJECT_NOTIFICATION.SUCCESS,
        payload: { subscribe },
      }),
    )
    .catch(err => {
      message.error(err.message);

      return dispatch({
        type: BELL_USER_NOTIFICATION.ERROR,
      });
    });
};

export const getWobjectExpertise = (newsFilter = {}, authorPermlink) => (dispatch, getState) => {
  const state = getState();

  const username = getAuthenticatedUserName(state);
  const wObject = getObjectState(state);
  const objAuthorPermlink = authorPermlink || wObject.author_permlink;

  return dispatch({
    type: GET_WOBJECT_EXPERTISE.ACTION,
    payload: {
      promise: getWobjectsExpertiseWithNewsFilter(username, objAuthorPermlink, 0, 5, newsFilter),
    },
  });
};

export const followUserWObjectExpertise = userExpert => dispatch =>
  dispatch({
    type: FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE.ACTION,
    payload: {
      promise: dispatch(followExpert(userExpert)),
    },
    meta: {
      userExpert,
    },
  });

export const unfollowUserWObjectExpertise = userExpert => dispatch =>
  dispatch({
    type: FOLLOW_UNFOLLOW_USER_WOBJECT_EXPERTISE.ACTION,
    payload: {
      promise: dispatch(unfollowExpert(userExpert)),
    },
    meta: {
      userExpert,
    },
  });

export const getRelatedWobjects = objPermlink => (dispatch, getState) => {
  const state = getState();
  const wobject = getObjectState(state);
  const relatedObjectsSkip = getRelatedObjectsSkip(state);
  const relatedObjects = getRelatedObjectsArray(state);
  const hasMore = getRelatedObjectsHasNext(state);
  const usedLocale = getUsedLocale(state);
  const objName = wobject.author_permlink || objPermlink;
  const notHaveObjects = size(relatedObjects) % 5;

  if (hasMore && !notHaveObjects) {
    dispatch({
      type: GET_RELATED_WOBJECT.ACTION,
      payload: {
        promise: getAuthorsChildWobjects(objName, relatedObjectsSkip, 5, usedLocale),
      },
      meta: {
        wobject,
      },
    });
  }
};
