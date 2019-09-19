import { createAsyncActionType } from '../helpers/stateHelpers';
import {
  getActiveFilters,
  getTypeName,
  getObjectTypeSorting,
  getUserLocation,
  getQueryString,
} from '../reducers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_OBJECT_TYPE = createAsyncActionType('@objectType/GET_OBJECT_TYPE');
export const CLEAR_OBJECT_TYPE = '@objectType/CLEAR_OBJECT_TYPE';
export const UPDATE_ACTIVE_FILTERS = '@objectType/UPDATE_ACTIVE_FILTERS';
export const CHANGE_SORTING = '@objectType/CHANGE_SORTING';

/**
 * Action to get wobject of specific type with related wobjects
 *
 * @param {string} typeName - name of the Object Type
 * @param {number} limit - count of wobjects to return
 * @param {number} skip - count of skipping objects (for infinite scroll)
 * @returns {Function} - dispatch action
 */
export const getObjectType = (typeName, { limit = 15, skip = 0 } = { limit: 15, skip: 0 }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const activeFilters = { ...getActiveFilters(state) };
  const sort = getObjectTypeSorting(state);
  const searchString = new URLSearchParams(getQueryString(state)).get('search');

  // if use sort by proximity, require to use map filter
  if (sort === 'proximity' && !activeFilters.map) {
    const userLocation = getUserLocation(state);
    activeFilters.map = {
      coordinates: [Number(userLocation.lat), Number(userLocation.lon)],
      radius: 50000000,
    };
  }
  if (searchString) {
    activeFilters.searchString = searchString;
  }
  dispatch({
    type: GET_OBJECT_TYPE.ACTION,
    payload: ApiClient.getObjectType(typeName, { limit, skip, filter: activeFilters, sort }),
    meta: {
      initialLoad: skip === 0,
    },
  });
};

export const clearType = () => dispatch => {
  dispatch({ type: CLEAR_OBJECT_TYPE });
  return Promise.resolve();
};

export const setActiveFilters = filters => dispatch => {
  dispatch({
    type: UPDATE_ACTIVE_FILTERS,
    payload: filters,
  });
  return Promise.resolve();
};

export const setFiltersAndLoad = filters => (dispatch, getState) => {
  dispatch(setActiveFilters(filters)).then(() => {
    const typeName = getTypeName(getState());
    if (typeName) dispatch(getObjectType(typeName));
  });
};

export const changeSorting = sorting => dispatch => {
  dispatch({
    type: CHANGE_SORTING,
    payload: sorting,
  });
  return Promise.resolve();
};

export const changeSortingAndLoad = sorting => (dispatch, getState) => {
  dispatch(changeSorting(sorting)).then(() => {
    const typeName = getTypeName(getState());
    if (typeName) dispatch(getObjectType(typeName));
  });
};
