import { createAsyncActionType } from '../helpers/stateHelpers';
import {
  getActiveFilters,
  getTypeName,
  getObjectTypeSorting,
  getUserLocation,
  getQueryString,
  getSuitableLanguage,
  getAuthenticatedUserName,
} from '../reducers';
import * as ApiClient from '../../waivioApi/ApiClient';

export const GET_OBJECT_TYPE = createAsyncActionType('@objectType/GET_OBJECT_TYPE');
export const GET_OBJECT_TYPE_MAP = createAsyncActionType('@objectType/GET_OBJECT_TYPE_MAP');
export const CLEAR_OBJECT_TYPE = '@objectType/CLEAR_OBJECT_TYPE';
export const UPDATE_ACTIVE_FILTERS = '@objectType/UPDATE_ACTIVE_FILTERS';
export const CHANGE_SORTING = '@objectType/CHANGE_SORTING';

/**
 * Action to get wobject of specific type with related wobjects
 *
 * @param {string} objectTypeName - name of the Object Type
 * @param {string} actionType - action to dispatch
 * @param {object} filters - filters for related wobjects
 * @param {number} limit - count of wobjects to return
 * @param {number} skip - count of skipping objects (for infinite scroll)
 * @returns {Function} - dispatch action
 */
export const getObjectType = (objectTypeName, actionType, filters, { limit = 30, skip = 0 } = { }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const usedLocale = getSuitableLanguage(state);
  const sort = getObjectTypeSorting(state);

  const preparedData = {
    wobjects_count: limit,
    wobjects_skip: skip,
    filter: filters,
    sort,
  };
  if (username) preparedData.userName = username;
  dispatch({
    type: actionType,
    payload: ApiClient.getObjectType(objectTypeName, preparedData),
    meta: {
      locale: usedLocale,
    },
  });
};

export const getObjectTypeMap = ( map = {}) => (dispatch) => {
  const filters = {rating: [], map};
  const typeName = 'restaurant';
  const actionType = GET_OBJECT_TYPE_MAP.ACTION;
  return dispatch(getObjectType(typeName, actionType, filters, { limit: 50, skip: 0 }));
};

export const getObjectTypeByStateFilters = (typeName, { skip = 0, limit = 15 } = {}) => (dispatch, getState) => {
  const state = getState();
  const activeFilters = { ...getActiveFilters(state) };
  const searchString = new URLSearchParams(getQueryString(state)).get('search');
  const sort = getObjectTypeSorting(state);

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
  const actionType = GET_OBJECT_TYPE.ACTION;
  return dispatch(getObjectType(typeName, actionType, activeFilters, { limit, skip }));
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
    if (typeName) dispatch(getObjectTypeByStateFilters(typeName));
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
    if (typeName) dispatch(getObjectTypeByStateFilters(typeName));
  });
};
