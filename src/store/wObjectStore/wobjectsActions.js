import { isEmpty } from 'lodash';
import { parseWobjectField } from '../../common/helpers/wObjectHelper';
import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAlbums } from '../galleryStore/galleryActions';
import { getObjectPermlink } from '../../client/vendor/steemitHelpers';
import { followObject, voteObject } from './wobjActions';
import { getCurrentHost } from '../appStore/appSelectors';
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
  const usedLocale = getLocale(getState());

  return dispatch({
    type: GET_OBJECT,
    payload: ApiClient.getObject(authorPermlink, user, usedLocale)
      .then(res => res)
      .catch(() => dispatch({ type: GET_OBJECT_ERROR })),
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

  const { votePower, follow, like, ...wobj } = postData;
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
    if (like) dispatch(voteObject(response.author, response.permlink, votePower));

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

export const GET_ADD_ONS = createAsyncActionType('@wobj/GET_ADD_ONS');

export const getAddOns = (addOnPermlinks, userName, limit = 30) => dispatch => {
  if (!isEmpty(addOnPermlinks))
    return dispatch({
      type: GET_ADD_ONS.ACTION,
      payload: ApiClient.getObjectsByIds({
        authorPermlinks: addOnPermlinks,
        authUserName: userName,
        limit,
        skip: 0,
      }),
    });

  return dispatch({
    type: GET_ADD_ONS.SUCCESS,
    payload: {
      wobjects: [],
    },
  });
};

export const GET_SIMILAR_OBJECTS = createAsyncActionType('@wobj/GET_SIMILAR_OBJECTS');

export const getSimilarObjects = (author_permlink, userName, locale, limit = 30) => dispatch =>
  dispatch({
    type: GET_SIMILAR_OBJECTS.ACTION,
    payload: ApiClient.getSimilarObjectsFromDepartments(
      author_permlink,
      userName,
      locale,
      0,
      limit,
    ),
  });
export const GET_RELATED_OBJECTS = createAsyncActionType('@wobj/GET_RELATED_OBJECTS');

export const getRelatedObjects = (author_permlink, userName, locale, limit = 30) => dispatch =>
  dispatch({
    type: GET_RELATED_OBJECTS.ACTION,
    payload: ApiClient.getRelatedObjectsFromDepartments(
      author_permlink,
      userName,
      locale,
      0,
      limit,
    ),
  });

export const GET_MENU_ITEM_CONTENT = createAsyncActionType('@wobj/GET_MENU_ITEM_CONTENT');

export const getMenuItemContent = (author_permlink, userName, locale) => dispatch =>
  dispatch({
    type: GET_MENU_ITEM_CONTENT.ACTION,
    payload: ApiClient.getObject(author_permlink, userName, locale),
    meta: author_permlink,
  });

export const GET_PRODUCT_INFO = createAsyncActionType('@wobj/GET_PRODUCT_INFO');

export const getProductInfo = (wobject, locale) => dispatch => {
  const manufacturer = parseWobjectField(wobject, 'manufacturer');
  const brand = parseWobjectField(wobject, 'brand');
  const merchant = parseWobjectField(wobject, 'merchant');

  const permlinks = [
    manufacturer?.authorPermlink,
    brand?.authorPermlink,
    merchant?.authorPermlink,
  ].filter(permlink => permlink);

  return dispatch({
    type: GET_PRODUCT_INFO.ACTION,
    payload: ApiClient.getObjectInfo(permlinks, locale).then(res => {
      const brandObject =
        res.wobjects.find(obj => obj.author_permlink === brand?.authorPermlink) || brand;
      const manufacturerObject =
        res.wobjects.find(obj => obj.author_permlink === manufacturer?.authorPermlink) ||
        manufacturer;
      const merchantObject =
        res.wobjects.find(obj => obj.author_permlink === merchant?.authorPermlink) || merchant;

      return { brandObject, manufacturerObject, merchantObject };
    }),
  });
};
