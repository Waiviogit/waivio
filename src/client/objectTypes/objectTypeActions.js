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
 * @param {string} typeName - name of the Object Type
 * @param {number} limit - count of wobjects to return
 * @param {number} skip - count of skipping objects (for infinite scroll)
 * @returns {Function} - dispatch action
 */
export const getObjectType = (typeName, { limit = 20, skip = 0 } = { limit: 20, skip: 0 }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const usedLocale = getSuitableLanguage(state);
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
  const preparedData = {
    wobjects_count: limit,
    wobjects_skip: skip,
    filter: activeFilters,
    sort,
  };
  if (username) preparedData.userName = username;
  dispatch({
    type: GET_OBJECT_TYPE.ACTION,
    payload: ApiClient.getObjectType(typeName, preparedData),
    meta: {
      locale: usedLocale,
    },
  });
};

export const getObjectTypeMap = ({ limit = 20, skip = 0, map = {} } = { limit: 20, skip: 0, map: {} }) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const typeName = getTypeName(state);
  const username = getAuthenticatedUserName(state);
  const usedLocale = getSuitableLanguage(state);
  const sort = getObjectTypeSorting(state);

  const preparedData = {
    wobjects_count: limit,
    wobjects_skip: skip,
    filter: {rating: [], map },
    sort,
  };
  if (username) preparedData.userName = username;
  dispatch({
    type: GET_OBJECT_TYPE_MAP.ACTION,
    payload: ApiClient.getObjectType(typeName, preparedData),
    meta: {
      locale: usedLocale,
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
