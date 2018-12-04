import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';

export const GET_OBJECT = createAsyncActionType('@objects/GET_OBJECT');
export const GET_USERS_BY_OBJECT = createAsyncActionType('@objects/GET_USERS_BY_OBJECT');
export const GET_FEED_CONTENT_BY_OBJECT = createAsyncActionType(
  '@objects/GET_FEED_CONTENT_BY_OBJECT',
);

export const getObject = name => dispatch =>
  dispatch({
    type: GET_OBJECT.ACTION,
    payload: ApiClient.getObject(name),
  });

export const getUsersByObject = object => dispatch =>
  dispatch({
    type: GET_USERS_BY_OBJECT.ACTION,
    payload: ApiClient.getUsersByObject(object),
  }).catch(() => {});

export const getFeedContentByObject = object => dispatch =>
  dispatch({
    type: GET_FEED_CONTENT_BY_OBJECT.ACTION,
    payload: ApiClient.getFeedContentByObject(object),
  }).catch(() => {});
