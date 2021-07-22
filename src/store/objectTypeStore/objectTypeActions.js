import { omit } from 'lodash';
import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import { getQueryString } from '../reducers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { createFilterBody } from '../../client/discoverObjects/helper';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import {
  getActiveFilters,
  getActiveFiltersTags,
  getObjectTypeSorting,
  getTypeName,
} from './objectTypeSelectors';
import { getUserLocation } from '../userStore/userSelectors';
import { getLocale } from '../settingsStore/settingsSelectors';

export const GET_OBJECT_TYPE = createAsyncActionType('@objectType/GET_OBJECT_TYPE');
export const GET_OBJECT_TYPE_MAP = createAsyncActionType('@objectType/GET_OBJECT_TYPE_MAP');
export const CLEAR_OBJECT_TYPE = '@objectType/CLEAR_OBJECT_TYPE';
export const UPDATE_ACTIVE_FILTERS = '@objectType/UPDATE_ACTIVE_FILTERS';
export const CHANGE_SORTING = '@objectType/CHANGE_SORTING';
export const RESET_UPDATED_STATE = '@objectType/RESET_UPDATED_STATE';
export const SET_OBJECT_SORT_TYPE = '@objectType/SET_OBJECT_SORT_TYPE';

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

export const setObjectSortType = payload => ({
  type: SET_OBJECT_SORT_TYPE,
  payload,
});

export const getObjectType = (
  objectTypeName,
  actionType,
  filters,
  { limit = 30, skip = 0, simplified = false } = {},
  filterBody,
) => (dispatch, getState) => {
  const state = getState();
  const username = getAuthenticatedUserName(state);
  const sort = getObjectTypeSorting(state);
  const locale = getLocale(state);

  const changeFilters = omit(filters, ['map.zoom']);
  const preparedData = {
    wobjects_count: limit,
    simplified,
    wobjects_skip: skip,
    filter: {
      ...changeFilters,
      tagCategory: filterBody,
    },
    sort,
    locale,
  };

  if (username) preparedData.userName = username;
  dispatch({
    type: actionType,
    payload: ApiClient.getObjectType(objectTypeName, preparedData),
    meta: {
      locale,
    },
  });
};

export const getObjectTypeMap = ({ radius, coordinates } = {}, isFullscreenMode) => (
  dispatch,
  getState,
) => {
  const state = getState();
  const typeName = getTypeName(state);
  const actionType = GET_OBJECT_TYPE_MAP.ACTION;
  const activeFilters = getActiveFilters(state);
  const filterBody = createFilterBody(getActiveFiltersTags(state));
  const searchString = new URLSearchParams(getQueryString(state)).get('search');
  const filters = { rating: [], map: { radius, coordinates }, ...activeFilters };

  if (!typeName) return null;

  if (searchString) filters.searchString = searchString;

  const getLimit = () => {
    let limit = 50;

    if (isFullscreenMode) limit = 200;

    return limit;
  };

  return dispatch(
    getObjectType(
      typeName,
      actionType,
      filters,
      { limit: getLimit(), skip: 0, simplified: true },
      filterBody,
    ),
  );
};

export const getObjectTypeByStateFilters = (
  typeName,
  { skip = 0, limit = 15, simplified = false } = {},
) => (dispatch, getState) => {
  const state = getState();
  const activeFilters = getActiveFilters(state);
  const filterBody = createFilterBody(getActiveFiltersTags(state));
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

  return dispatch(
    getObjectType(typeName, actionType, activeFilters, { limit, skip, simplified }, filterBody),
  );
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

export const resetUpdatedFlag = () => dispatch => {
  dispatch({
    type: RESET_UPDATED_STATE,
  });
};

export const SHOW_MORE_TAGS_FOR_FILTERS = createAsyncActionType(
  '@objectType/SHOW_MORE_TAGS_FOR_FILTERS',
);

export const showMoreTags = (category, skip, limit) => dispatch =>
  dispatch({
    type: SHOW_MORE_TAGS_FOR_FILTERS.ACTION,
    payload: ApiClient.showMoreTagsForFilters(category, skip, limit),
    meta: category,
  });

export const SET_ACTIVE_TAGS_FILTERS = '@objectType/SET_ACTIVE_TAGS_FILTERS';

export const setActiveTagsFilters = filters => dispatch => {
  dispatch({
    type: SET_ACTIVE_TAGS_FILTERS,
    payload: filters,
  });

  return Promise.resolve();
};

export const setTagsFiltersAndLoad = filters => (dispatch, getState) => {
  dispatch(setActiveTagsFilters(filters)).then(() => {
    const typeName = getTypeName(getState());

    if (typeName) dispatch(getObjectTypeByStateFilters(typeName));
  });
};
