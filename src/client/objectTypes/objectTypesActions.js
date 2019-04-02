import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_OBJECT_TYPES = createAsyncActionType('@objectTypes/GET_OBJECT_TYPES');

export const getObjectTypes = (limit = 10, skip = 0, wobjectsCount = 3) => dispatch => {
  dispatch({
    type: GET_OBJECT_TYPES.ACTION,
    payload: ApiClient.getObjectTypes(limit, skip, wobjectsCount),
  });
};
