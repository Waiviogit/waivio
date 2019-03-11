import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAlbums } from '../object/ObjectGallery/galleryActions';
import { createPermlink } from '../vendor/steemitHelpers';
import { generateRandomString } from '../helpers/wObjectHelper';
import { followObject, voteObject } from './wobjActions';

export const GET_OBJECT = '@objects/GET_OBJECT';
export const GET_OBJECT_START = '@objects/GET_OBJECT_START';
export const GET_OBJECT_ERROR = '@objects/GET_OBJECT_ERROR';
export const GET_OBJECT_SUCCESS = '@objects/GET_OBJECT_SUCCESS';

export const getObject = name => dispatch =>
  dispatch({
    type: GET_OBJECT,
    payload: ApiClient.getObject(name),
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

export const getObjectInfo = authorPermlink => dispatch => {
  dispatch(getObject(authorPermlink));
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
      promise: createPermlink(wobj.id, auth.user.name, '', 'waiviodev').then(permlink => {
        const requestBody = {
          author: auth.user.name,
          title: `${wobj.name} - waivio object`,
          body: `Waivio object "${wobj.name}" has been created`,
          permlink: `${generateRandomString(3).toLowerCase()}-${permlink}`,
          objectName: wobj.name,
          locale: wobj.locale || settings.locale === 'auto' ? 'en-US' : settings.locale,
          type: wobj.type,
          isExtendingOpen: Boolean(wobj.isExtendingOpen),
          isPostingOpen: Boolean(wobj.isPostingOpen),
        };
        return ApiClient.postCreateWaivioObject(requestBody).then(response => {
          if (follow) {
            dispatch(followObject(response.permlink));
          }
          dispatch(voteObject(response.author, response.permlink, votePower));
          return response;
        });
      }),
    },
  });
};
