import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAlbums } from '../object/ObjectGallery/galleryActions';
import { createPermlink } from '../vendor/steemitHelpers';
import { generateRandomString } from '../helpers/wObjectHelper';
import { followObject, voteObject } from './wobjActions';
import { getUsedLocale } from '../reducers';
import { getClientWObj } from '../adapters';
import { WAIVIO_PARENT_PERMLINK } from '../../common/constants/waivio';

export const GET_OBJECT = '@objects/GET_OBJECT';
export const GET_OBJECT_START = '@objects/GET_OBJECT_START';
export const GET_OBJECT_ERROR = '@objects/GET_OBJECT_ERROR';
export const GET_OBJECT_SUCCESS = '@objects/GET_OBJECT_SUCCESS';

export const getObject = (authorPermlink, username) => (dispatch, getState) => {
  const usedLocale = getUsedLocale(getState());
  return dispatch({
    type: GET_OBJECT,
    payload: ApiClient.getObject(authorPermlink, username)
      .then(wobj => getClientWObj(wobj, usedLocale))
      .catch(err => console.log(err)),
  });
};
export const clearObjectFromStore = () => dispatch =>
  dispatch({
    type: GET_OBJECT_SUCCESS,
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
export const getFeedContentByObject = object => dispatch =>
  dispatch({
    type: GET_FEED_CONTENT_BY_OBJECT.ACTION,
    payload: ApiClient.getFeedContentByObject(object),
  }).catch(() => {});

export const getObjectInfo = (authorPermlink, username) => dispatch => {
  dispatch(clearObjectFromStore());
  dispatch(getObject(authorPermlink, username));
  dispatch(getAlbums(authorPermlink));
};

export const CREATE_WOBJECT = '@wobj/CREATE_WOBJECT';

export const createWaivioObject = postData => (dispatch, getState) => {
  const { auth, settings } = getState();
  if (!auth.isAuthenticated) {
    return null;
  }

  const { votePower, follow, ...wobj } = postData;

  return dispatch({
    type: CREATE_WOBJECT,
    payload: {
      promise: createPermlink(wobj.id, auth.user.name, '', WAIVIO_PARENT_PERMLINK).then(
        permlink => {
          const requestBody = {
            author: auth.user.name,
            title: `${wobj.name} - investArena topic`,
            body: `InvestArena topic "${wobj.name}" has been created`,
            permlink: `${generateRandomString(3).toLowerCase()}-${permlink}`,
            objectName: wobj.name,
            locale: wobj.locale || settings.locale === 'auto' ? 'en-US' : settings.locale,
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
