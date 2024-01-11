import { createSelector } from 'reselect';

// selector
export const favoritesState = state => state.favorites;

// reselect function
export const getFavoriteCategories = createSelector([favoritesState], state => state.categories);
export const getFavoriteObjects = createSelector([favoritesState], state => state.favoriteObjects);
export const getFavoriteObjectTypes = createSelector(
  [favoritesState],
  state => state.favoriteObjectTypes,
);
export const getLoadingFavoriteObjectTypes = createSelector(
  [favoritesState],
  state => state.loadingObjectTypes,
);
export const getLoadingFavoriteObjects = createSelector(
  [favoritesState],
  state => state.loadingObjects,
);
export const hasMoreFavoriteObjects = createSelector([favoritesState], state => state.hasMore);
