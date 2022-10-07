import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAlbums } from '../galleryStore/galleryActions';
import { getObjectPermlink } from '../../client/vendor/steemitHelpers';
import { followObject, voteObject } from './wobjActions';
import { getCurrentHost, getUsedLocale } from '../appStore/appSelectors';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';
import { checkExistPermlink } from '../../waivioApi/ApiClient';

export const GET_OBJECT = '@objects/GET_OBJECT';
export const GET_OBJECT_START = '@objects/GET_OBJECT_START';
export const GET_OBJECT_ERROR = '@objects/GET_OBJECT_ERROR';
export const GET_OBJECT_SUCCESS = '@objects/GET_OBJECT_SUCCESS';
export const CLEAR_OBJECT = '@objects/CLEAR_OBJECT';
export const GET_OBJECT_FOLLOWERS = createAsyncActionType('@objects/GET_OBJECT_FOLLOWERS');
export const GET_OBJECTS_NEARBY = createAsyncActionType('@objects/GET_OBJECTS_NEARBY');

export const getObjectFollowers = ({ object, skip, limit, userName, sort = 'rank' }) => dispatch =>
  dispatch({
    type: GET_OBJECT_FOLLOWERS.ACTION,
    payload: {
      promise: ApiClient.getWobjectFollowers(object, skip, limit, sort, userName),
    },
  });

export const getObject = (authorPermlink, user) => (dispatch, getState) => {
  const usedLocale = getUsedLocale(getState());

  return dispatch({
    type: GET_OBJECT,
    payload: ApiClient.getObject(authorPermlink, user, usedLocale).catch(() =>
      dispatch({ type: GET_OBJECT_ERROR }),
    ),
  });
};

export const clearObjectFromStore = () => dispatch =>
  dispatch({
    type: CLEAR_OBJECT,
    payload: {},
  });

export const GET_USERS_BY_OBJECT = createAsyncActionType('@objects/GET_USERS_BY_OBJECT');

export const getUsersByObject = object => dispatch =>
  dispatch({
    type: GET_USERS_BY_OBJECT.ACTION,
    payload: ApiClient.getUsersByObject(object),
  });

export const GET_FEED_CONTENT_BY_OBJECT = createAsyncActionType(
  '@objects/GET_FEED_CONTENT_BY_OBJECT',
);
export const getFeedContentByObject = object => (dispatch, getState) => {
  const state = getState();
  const locale = getLocale(state);
  const name = getAuthenticatedUserName(state);

  return dispatch({
    type: GET_FEED_CONTENT_BY_OBJECT.ACTION,
    payload: ApiClient.getFeedContentByObject(object, 10, '', locale, name),
  }).catch(() => {});
};

export const getObjectInfo = (authorPermlink, username, requiredField) => dispatch => {
  dispatch(getAlbums(authorPermlink));
  dispatch(getObject(authorPermlink, username, requiredField));
};

export const CREATE_WOBJECT = '@wobj/CREATE_WOBJECT';

// eslint-disable-next-line consistent-return
export const createWaivioObject = postData => async (dispatch, getState) => {
  const { auth, settings } = getState();

  if (!auth.isAuthenticated) return null;

  const { votePower, follow, ...wobj } = postData;
  const isHashtag = wobj.type === 'hashtag';

  if (isHashtag) {
    const hashtagName = wobj.name
      .toLowerCase()
      .split(' ')
      .join('');

    const { exist } = await checkExistPermlink(hashtagName);

    if (exist) return Promise.reject('object_exist');
  }

  const getBodyDifferenceItem = async () => {
    let permlink;
    let objectName;

    if (isHashtag) {
      objectName = wobj.name.toLowerCase().replace(' ', '');
      permlink = objectName;
    } else {
      permlink = await getObjectPermlink(wobj.id);
      objectName = wobj.name;
    }

    return {
      permlink,
      objectName,
    };
  };

  const requestBody = {
    ...(await getBodyDifferenceItem()),
    author: auth.user.name,
    title: `${wobj.name} - waivio object`,
    body: `Waivio object "${wobj.name}" has been created`,
    locale: wobj.locale || (settings.locale === 'auto' ? 'en-US' : settings.locale),
    type: wobj.type,
    isExtendingOpen: Boolean(wobj.isExtendingOpen),
    isPostingOpen: Boolean(wobj.isPostingOpen),
    parentAuthor: wobj.parentAuthor,
    parentPermlink: wobj.parentPermlink,
  };

  return ApiClient.postCreateWaivioObject(requestBody).then(response => {
    if (follow) {
      dispatch(followObject(response.permlink));
    }
    dispatch(voteObject(response.author, response.permlink, votePower));

    return response;
  });
};

export const getNearbyObjects = authorPermlink => (dispatch, getState) => {
  const state = getState();
  const domain = getCurrentHost(state);

  return dispatch({
    type: GET_OBJECTS_NEARBY.ACTION,
    payload: ApiClient.getNearbyObjects(authorPermlink, domain).catch(() =>
      dispatch({ type: GET_OBJECT_ERROR }),
    ),
  });
};

export const ADD_ITEM_TO_LIST = '@wobj/ADD_ITEM_TO_LIST';

export const addListItem = item => dispatch =>
  dispatch({
    type: ADD_ITEM_TO_LIST,
    payload: item,
  });
