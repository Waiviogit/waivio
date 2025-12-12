import { createAction } from 'redux-actions';
import { message } from 'antd';
import { get, size } from 'lodash';

import { getAllFollowing } from '../../common/helpers/apiHelpers';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { openLinkWithSafetyCheck } from '../../common/helpers/urlHelpers';
import {
  checkLinkSafety,
  getAuthorsChildWobjects,
  getWobjectsExpertiseWithNewsFilter,
} from '../../waivioApi/ApiClient';
import { BELL_USER_NOTIFICATION, followExpert, unfollowExpert } from '../userStore/userActions';
import { getAuthenticatedUserName, getIsAuthenticated } from '../authStore/authSelectors';
import {
  getRelatedObjectsSkip,
  getRelatedObjectsArray,
  getRelatedObjectsHasNext,
  getObject as getObjectState,
} from './wObjectSelectors';
import { getAppHost, getUsedLocale } from '../appStore/appSelectors';
import { getExitPageSetting } from '../settingsStore/settingsSelectors';

export const FOLLOW_WOBJECT = '@wobj/FOLLOW_WOBJECT';
export const FOLLOW_WOBJECT_START = '@wobj/FOLLOW_WOBJECT_START';
export const FOLLOW_WOBJECT_SUCCESS = '@wobj/FOLLOW_WOBJECT_SUCCESS';
export const FOLLOW_WOBJECT_ERROR = '@wobj/FOLLOW_WOBJECT_ERROR';
export const CLEAR_RELATED_OBJECTS = '@wobj/CLEAR_RELATED_OBJECTS';
export const RESET_WOBJECT_EXPERTISE = '@wobj/RESET_WOBJECT_EXPERTISE';
export const RESET_LINK_SAFETY = '@wobj/RESET_LINK_SAFETY';
export const SET_LINK_SAFETY = createAsyncActionType('@wobj/SET_LINK_SAFETY');
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
export const GET_CHANGED_WOBJECT_UPDATE = createAsyncActionType('@wobj/GET_CHANGED_WOBJECT_UPDATE');

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
export const SET_AUTHORS = '@wobj/SET_AUTHORS';

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

export const rejectListItem = (voter, author, permlink, weight) => (
  dispatch,
  getState,
  { steemConnectAPI },
) => steemConnectAPI.vote(voter, author, permlink, weight).then(res => res);

export const setAuthors = authors => ({
  type: SET_AUTHORS,
  authors,
});

export const SET_BREDCRUMB_FOR_CHECKLIST = '@wobj/SET_BREDCRUMB_FOR_CHECKLIST';

export const setBreadcrumbForChecklist = crumb => ({
  type: SET_BREDCRUMB_FOR_CHECKLIST,
  crumb,
});

export const SET_EDIT_MODE = '@objects/SET_EDIT_MODE';
export const setEditMode = mode => ({
  type: SET_EDIT_MODE,
  mode,
});

export const SET_ALL_BREDCRUMBS_FOR_CHECKLIST = '@wobj/SET_ALL_BREDCRUMBS_FOR_CHECKLIST';

export const setAllBreadcrumbsForChecklist = crumbs => ({
  type: SET_ALL_BREDCRUMBS_FOR_CHECKLIST,
  crumbs,
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

export const getWobjectExpertise = (newsFilter = {}, authorPermlink, isSocial = false) => (
  dispatch,
  getState,
) => {
  const state = getState();

  const username = getAuthenticatedUserName(state);
  const wObject = getObjectState(state);
  const appHost = getAppHost(state);
  const objAuthorPermlink = authorPermlink || wObject.author_permlink;

  return dispatch({
    type: GET_WOBJECT_EXPERTISE.ACTION,
    payload: {
      promise: getWobjectsExpertiseWithNewsFilter(
        username,
        objAuthorPermlink,
        0,
        isSocial ? 30 : 5,
        newsFilter,
        appHost,
      ),
    },
  });
};

export const setLinkSafetyInfo = url => async (dispatch, getState) => {
  const mainWaivioLink = 'https://www.waivio.com';

  if (url?.includes(mainWaivioLink)) {
    if (typeof window !== 'undefined') window.open(url, '_blank');

    return;
  }

  // eslint-disable-next-line consistent-return
  return openLinkWithSafetyCheck(url, safeUrl =>
    originalSetLinkSafetyInfo(safeUrl)(dispatch, getState),
  );
};

export const originalSetLinkSafetyInfo = url => async (dispatch, getState) => {
  const waivioLink = url?.includes('/object/') || (url?.includes('/@') && !url?.includes('http'));
  const isAuth = getIsAuthenticated(getState());
  const checkLinks = getExitPageSetting(getState());
  const result = waivioLink ? {} : await checkLinkSafety(url);
  const rating = Math.round(result?.rating);
  const showModal = (isAuth && checkLinks) || (rating < 5 && rating > 0);

  const payloadData = waivioLink
    ? { showModal: false, isWaivioLink: true }
    : { ...result, rating, showModal, checkLinks };

  const promise = Promise.resolve(payloadData);

  if (waivioLink) {
    dispatch({
      type: SET_LINK_SAFETY.ACTION,
      payload: { promise },
      meta: url,
    });

    return promise;
  }

  dispatch({
    type: SET_LINK_SAFETY.ACTION,
    payload: { promise },
    meta: url,
  });

  return promise;
};

export const resetLinkSafetyInfo = () => dispatch =>
  dispatch({
    type: RESET_LINK_SAFETY,
  });

export const resetWobjectExpertise = () => dispatch =>
  dispatch({
    type: RESET_WOBJECT_EXPERTISE,
  });

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

export const RESET_OBJ_STATE = '@wobj/RESET_OBJ_STATE';

export const resetObjState = () => ({
  type: RESET_OBJ_STATE,
});
