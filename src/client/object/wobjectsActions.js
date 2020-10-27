import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAlbums } from './ObjectGallery/galleryActions';
import { createPermlink } from '../vendor/steemitHelpers';
import { generateRandomString } from '../helpers/wObjectHelper';
import { followObject, voteObject } from './wobjActions';
import { getAuthenticatedUserName, getLocale, getUsedLocale } from '../reducers';
import { WAIVIO_PARENT_PERMLINK } from '../../common/constants/waivio';

export const GET_OBJECT = '@objects/GET_OBJECT';
export const GET_OBJECT_START = '@objects/GET_OBJECT_START';
export const GET_OBJECT_ERROR = '@objects/GET_OBJECT_ERROR';
export const GET_OBJECT_SUCCESS = '@objects/GET_OBJECT_SUCCESS';
export const CLEAR_OBJECT = '@objects/CLEAR_OBJECT';

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
  }).catch(() => {});

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
export const createWaivioObject = postData => (dispatch, getState) => {
  const { auth, settings } = getState();

  if (!auth.isAuthenticated) {
    return null;
  }

  const { votePower, follow, ...wobj } = postData;

  if (wobj.type === 'hashtag') {
    const hashtagName = wobj.name.toLowerCase();
    return dispatch({
      type: CREATE_WOBJECT,
      payload: {
        promise: new Promise((resolve, reject) =>
          ApiClient.getObject(hashtagName, auth.user.name)
            .then(() => reject('object_exist'))
            .catch(() => {
              const requestBody = {
                author: auth.user.name,
                title: `${hashtagName} - waivio object`,
                body: `Waivio object "${hashtagName}" has been created`,
                permlink: hashtagName,
                objectName: hashtagName,
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

                return resolve(response);
              });
            }),
        ),
      },
    });
  }

  return dispatch({
    type: CREATE_WOBJECT,
    payload: {
      promise: createPermlink(wobj.id, auth.user.name, '', WAIVIO_PARENT_PERMLINK).then(
        permlink => {
          const requestBody = {
            author: auth.user.name,
            title: `${wobj.name} - waivio object`,
            body: `Waivio object "${wobj.name}" has been created`,
            permlink: `${generateRandomString(3).toLowerCase()}-${permlink.toLowerCase()}`,
            objectName: wobj.name,
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
        },
      ),
    },
  });
};

export const ADD_ITEM_TO_LIST = '@wobj/ADD_ITEM_TO_LIST';

export const addListItem = item => dispatch =>
  dispatch({
    type: ADD_ITEM_TO_LIST,
    payload: item,
  });
