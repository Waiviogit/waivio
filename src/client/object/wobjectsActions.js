import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../helpers/stateHelpers';

export const GET_OBJECT = createAsyncActionType('@objects/GET_OBJECT');

export const getObject = name => dispatch =>
  dispatch({
    type: GET_OBJECT.ACTION,
    payload: ApiClient.getObject(name),
  }).catch(() => {});
