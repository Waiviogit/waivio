import { createSelector } from 'reselect';
// selector
export const getFavoritesState = (state) => state.favoriteQuotes;
// reselect function
export const makeIsFavoriteState = () => createSelector(
    getFavoritesState,
    (state, props) => props.quoteSecurity,
    (favorites, quoteSecurity) => favorites.includes(quoteSecurity)
);
