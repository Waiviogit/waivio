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
