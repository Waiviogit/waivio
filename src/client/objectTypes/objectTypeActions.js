import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_OBJECT_TYPE = createAsyncActionType('@objectType/GET_OBJECT_TYPE');
export const CLEAR_OBJECT_TYPE = 'CLEAR_OBJECT_TYPE';
export const UPDATE_ACTIVE_FILTERS = '@objectType/UPDATE_ACTIVE_FILTERS';

export const getObjectTypeMore = (name, { limit = 15, skip = 0, filter = {} }) => dispatch => {
  dispatch({
    type: GET_OBJECT_TYPE.ACTION,
    payload: ApiClient.getObjectType(name, { limit, skip, filter }),
  });
};

export const clearType = () => dispatch => {
  dispatch({ type: CLEAR_OBJECT_TYPE });
  return Promise.resolve();
};

export const getObjectType = (name, filter = {}) => dispatch => {
  dispatch(clearType()).then(() => {
    dispatch(getObjectTypeMore(name, { filter }));
  });
};

export const setActiveFilters = filters => dispatch =>
  dispatch({
    type: UPDATE_ACTIVE_FILTERS,
    payload: filters,
  });
