import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../reducers';

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

export const getAccount = name => dispatch => {
  dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: ApiClient.getUserAccount(name),
    meta: { username: name },
  }).catch(() => {});
};

export const getUserAccount = name => dispatch =>
  dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: ApiClient.getUserAccount(name),
    meta: { username: name },
  }).catch(() => {});

export const GET_RANDOM_EXPERTS = '@users/GET_RANDOM_EXPERTS';
export const GET_RANDOM_EXPERTS_START = '@users/GET_RANDOM_EXPERTS_START';
export const GET_RANDOM_EXPERTS_SUCCESS = '@users/GET_RANDOM_EXPERTS_SUCCESS';
export const GET_RANDOM_EXPERTS_ERROR = '@users/GET_RANDOM_EXPERTS_ERROR';

export const getRandomExperts = () => dispatch =>
  dispatch({
    type: GET_RANDOM_EXPERTS,
    payload: ApiClient.getTopUsers(true),
  });

export const GET_TOP_EXPERTS = '@users/GET_TOP_EXPERTS';
export const GET_TOP_EXPERTS_START = '@users/GET_TOP_EXPERTS_START';
export const GET_TOP_EXPERTS_SUCCESS = '@users/GET_TOP_EXPERTS_SUCCESS';
export const GET_TOP_EXPERTS_ERROR = '@users/GET_TOP_EXPERTS_ERROR';

export const getTopExperts = (limit = 20, skip = 0) => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());
  
  dispatch({
    type: GET_TOP_EXPERTS,
    payload: ApiClient.getTopUsers(false, { limit, skip }, user),
    meta: { limit },
  });
};

export const GET_USER_METADATA = createAsyncActionType('@users/GET_USER_METADATA');

export const getUserMetadata = () => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  if (userName) {
    return dispatch({
      type: GET_USER_METADATA.ACTION,
      payload: ApiClient.getAuthenticatedUserMetadata(userName),
    });
  }
  return dispatch({ type: GET_USER_METADATA.ERROR, payload: Promise.resolve(null) });
};
