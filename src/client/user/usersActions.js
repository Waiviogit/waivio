import { createAsyncActionType } from '../helpers/stateHelpers';
import { getAccountWithFollowingCount as getAccountWithFollowingCountAPI } from '../helpers/apiHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_ACCOUNT = createAsyncActionType('@users/GET_ACCOUNT');

export const getAccount = name => dispatch =>
  dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: getAccountWithFollowingCountAPI(name),
    meta: { username: name },
  }).catch(() => {});

export const getUserAccount = name => dispatch =>
  dispatch({
    type: GET_ACCOUNT.ACTION,
    payload: ApiClient.getAccountWithFollowingCount(name),
    meta: { username: name },
  }).catch(() => {});

export const GET_RANDOM_EXPERTS = '@users/GET_RANDOM_EXPERTS';
export const GET_RANDOM_EXPERTS_START = '@users/GET_RANDOM_EXPERTS_START';
export const GET_RANDOM_EXPERTS_SUCCESS = '@users/GET_RANDOM_EXPERTS_SUCCESS';
export const GET_RANDOM_EXPERTS_ERROR = '@users/GET_RANDOM_EXPERTS_ERROR';

export const getRandomExperts = () => dispatch =>
  dispatch({
    type: GET_RANDOM_EXPERTS,
    payload: ApiClient.getTopUsers({ sample: true }),
  });
