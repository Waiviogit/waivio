import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_OBJECT_TYPES = createAsyncActionType('@objectTypes/GET_OBJECT_TYPES');
export const GET_MORE_OBJECTS_BY_TYPE = createAsyncActionType(
  '@objectTypes/GET_MORE_OBJECTS_BY_TYPE',
);

export const getObjectTypes = (limit = 100, skip = 0, wobjectsCount = 3) => dispatch => {
  dispatch({
    type: GET_OBJECT_TYPES.ACTION,
    payload: ApiClient.getObjectTypes(limit, skip, wobjectsCount),
  });
};

export const getMoreObjectsByType = (type, skip = 0, limit = 30) => dispatch => {
  dispatch({
    type: GET_MORE_OBJECTS_BY_TYPE.ACTION,
    payload: ApiClient.getMoreObjectsByType(type, skip, limit),
  });
};
