import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import {
  getShopDepartments,
  getShopMainFeed,
  getShopUserDepartments,
  getUserShopMainFeed,
  getWobjectShopDepartments,
  getWobjectShopMainFeed,
} from '../../waivioApi/ApiClient';
import { getAppHost } from '../appStore/appSelectors';

export const SET_BREAD_CRUMB = '@shop/SET_BREAD_CRUMB';

export const setBreadCrumb = crumb => ({
  type: SET_BREAD_CRUMB,
  crumb,
});

export const SET_BREAD_ACTIVE_CRUMB = '@shop/SET_BREAD_CRUMB';

export const setBreadActiveCrumb = crumb => ({
  type: SET_BREAD_ACTIVE_CRUMB,
  crumb,
});

export const SET_EXCLUDED = '@shop/SET_EXCLUDED';

export const setExcluded = excluded => ({
  type: SET_EXCLUDED,
  excluded,
});

export const RESET_BREAD_CRUMB = '@shop/RESET_BREAD_CRUMB';

export const resetBreadCrumb = () => ({
  type: RESET_BREAD_CRUMB,
});
export const SET_OPTION_CLICKED = '@shop/SET_OPTION_CLICKED';

export const setOptionClicked = () => ({
  type: SET_OPTION_CLICKED,
});

export const RESET_OPTION_CLICKED = '@shop/RESET_OPTION_CLICKED';

export const resetOptionClicked = () => ({
  type: RESET_OPTION_CLICKED,
});

export const GET_DEPARTMENTS = createAsyncActionType('@shop/GET_DEPARTMENTS');

export const getWobjectDepartments = (name, department, excluded, path) => (dispatch, getState) => {
  const state = getState();
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_DEPARTMENTS.ACTION,
    payload: {
      promise: getWobjectShopDepartments(name, department, excluded, path, appHost),
    },
    meta: {
      department,
    },
  });
};

export const getUserDepartments = (name, department, excluded, path) => (dispatch, getState) => {
  const state = getState();
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_DEPARTMENTS.ACTION,
    payload: {
      promise: getShopUserDepartments(name, department, excluded, path, appHost),
    },
    meta: {
      department,
    },
  });
};

export const getGlobalDepartments = (name, department, excluded, path) => (dispatch, getState) => {
  const state = getState();
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_DEPARTMENTS.ACTION,
    payload: {
      promise: getShopDepartments(name, department, excluded, path, appHost),
    },
    meta: {
      department,
    },
  });
};

export const GET_SHOP_LIST = createAsyncActionType('@shop/GET_SHOP_LIST');

export const getGlobalShopList = (
  userName,
  follower,
  filter,
  excludedDepartments,
  department,
  skip,
  path,
  limit = 10,
  categoryLimit,
  isLoadMore,
) => (dispatch, getState) => {
  const state = getState();
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_SHOP_LIST.ACTION,
    payload: {
      promise: getShopMainFeed(
        userName,
        follower,
        filter,
        excludedDepartments,
        department,
        skip,
        path,
        limit,
        categoryLimit,
        appHost,
      ),
    },
    meta: {
      isLoadMore,
    },
  });
};

export const getUserShopList = (
  userName,
  follower,
  filter,
  excludedDepartments,
  department,
  skip,
  path,
  limit = 10,
  categoryLimit,
  isLoadMore,
) => (dispatch, getState) => {
  const state = getState();
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_SHOP_LIST.ACTION,
    payload: {
      promise: getUserShopMainFeed(
        userName,
        follower,
        filter,
        excludedDepartments,
        department,
        skip,
        path,
        limit,
        categoryLimit,
        appHost,
      ),
    },
    meta: {
      isLoadMore,
    },
  });
};

export const getWobjectsShopList = (
  userName,
  follower,
  filter,
  excludedDepartments,
  department,
  skip,
  path,
  limit = 10,
  categoryLimit,
  isLoadMore,
) => (dispatch, getState) => {
  const state = getState();
  const appHost = getAppHost(state);

  return dispatch({
    type: GET_SHOP_LIST.ACTION,
    payload: {
      promise: getWobjectShopMainFeed(
        userName,
        follower,
        filter,
        excludedDepartments,
        department,
        skip,
        path,
        limit,
        categoryLimit,
        appHost,
      ),
    },
    meta: {
      isLoadMore,
    },
  });
};
