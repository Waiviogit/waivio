import { createSelector } from 'reselect';

// selector
export const favoritesState = state => state.favorites;

// reselect function
export const getFavoriteCategories = createSelector([favoritesState], state => state.categories);
