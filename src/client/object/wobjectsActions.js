import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAlbums } from '../object/ObjectGallery/galleryActions';

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
