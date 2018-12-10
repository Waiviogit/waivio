import { GET_FAVORITES_SUCCESS, UPDATE_FAVORITE_SUCCESS } from '../actions/favoriteQuotesActions';

const initialState = [];

export default function (state = initialState, action) {
    switch (action.type) {
    case GET_FAVORITES_SUCCESS:
        return [...action.payload];
    case UPDATE_FAVORITE_SUCCESS:
        if (state.includes(action.payload)) {
            return state.filter(favoriteQuotes => favoriteQuotes !== action.payload);
        } else {
            return [...state, action.payload];
        }
    default:
        return state;
    }
}
