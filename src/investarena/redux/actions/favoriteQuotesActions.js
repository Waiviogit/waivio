import api from '../../configApi/apiResources';

export const GET_FAVORITES_SUCCESS = 'GET_FAVORITES_SUCCESS';
export const UPDATE_FAVORITE_SUCCESS = 'UPDATE_FAVORITE_SUCCESS';

export function getFavoritesSuccess (data) {
  return { type: GET_FAVORITES_SUCCESS, payload: data };
}

export function updateFavoriteSuccess (quoteSecurity) {
  return { type: UPDATE_FAVORITE_SUCCESS, payload: quoteSecurity };
}
export function getFavorites () {
    return (dispatch) => {
        return api.favorites.getFavorites()
            .then(({ data, error }) => {
                if (data && !error) {
                    dispatch(getFavoritesSuccess(data.favorites));
                }
            });
    };
}

export function updateFavorite (quoteSecurity) {
    return (dispatch) => {
        return api.favorites.updateFavorite(quoteSecurity)
            .then(({error}) => {
                if (!error) {
                    dispatch(updateFavoriteSuccess(quoteSecurity));
                }
            });
    };
}

