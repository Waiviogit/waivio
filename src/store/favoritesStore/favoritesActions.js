import { isEmpty } from 'lodash';
import { createAction } from 'redux-actions';
import { getUserFavoriteObjects, getUserFavoritesObjectTypesList } from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getFavoriteObjects } from './favoritesSelectors';

export const ADD_USER_FAVORITE = '@favorites/ADD_USER_FAVORITE';
export const REMOVE_USER_FAVORITE = '@favorites/REMOVE_USER_FAVORITE';

export const ADD_CATEGORY_FAVORITE = '@favorites/ADD_CATEGORY_FAVORITE';
export const REMOVE_CATEGORY_FAVORITE = '@favorites/REMOVE_CATEGORY_FAVORITE';

export const SET_FAVORITE_OBJECT_TYPES = createAsyncActionType(
  '@favorites/SET_FAVORITE_OBJECT_TYPES',
);
export const RESET_FAVORITES = '@favorites/RESET_FAVORITES';
export const SET_FAVORITE_OBJECTS = createAsyncActionType('@favorites/SET_FAVORITE_OBJECTS');
export const SET_MORE_FAVORITE_OBJECTS = createAsyncActionType(
  '@favorites/SET_MORE_FAVORITE_OBJECTS',
);

export const addUserFavorite = createAction(ADD_USER_FAVORITE);
export const removeUserFavorite = createAction(REMOVE_USER_FAVORITE);

export const addCategoryFavorite = createAction(ADD_CATEGORY_FAVORITE);
export const removeCategoryFavorite = createAction(REMOVE_CATEGORY_FAVORITE);

export const setFavoriteObjectTypes = userName => dispatch =>
  !isEmpty(userName) &&
  dispatch({
    type: SET_FAVORITE_OBJECT_TYPES.ACTION,
    payload: {
      promise: getUserFavoritesObjectTypesList(userName),
    },
  });
export const resetFavorites = () => dispatch =>
  dispatch({
    type: RESET_FAVORITES,
  });

export const setFavoriteObjects = (name, objectType) => (dispatch, getState) => {
  const authUserName = getAuthenticatedUserName(getState());

  return dispatch({
    type: SET_FAVORITE_OBJECTS.ACTION,
    payload: {
      promise: getUserFavoriteObjects(authUserName, name, objectType, 0),
    },
    meta: objectType,
  });
};
export const setMoreFavoriteObjects = (name, objectType) => (dispatch, getState) => {
  const authUserName = getAuthenticatedUserName(getState());
  const favorites = getFavoriteObjects(getState());

  if (!favorites[objectType]?.length) return Promise.resolve(null);
  const skip = favorites[objectType]?.length;

  return dispatch({
    type: SET_MORE_FAVORITE_OBJECTS.ACTION,
    payload: {
      promise: getUserFavoriteObjects(authUserName, name, objectType, skip),
    },
    meta: objectType,
  });
};
