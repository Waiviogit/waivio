import { isEmpty } from 'lodash';
import * as favoriteActions from './favoritesActions';

const initialState = {
  categories: [],
  users: [],
  favoriteObjectTypes: null,
  favoriteObjects: {},
  loadingObjects: true,
  loadingObjectTypes: true,
  hasMore: false,
};

const favoriteItem = (state = [], action) => {
  switch (action.type) {
    case favoriteActions.ADD_CATEGORY_FAVORITE:
    case favoriteActions.ADD_USER_FAVORITE:
      return [...state, action.payload];
    case favoriteActions.REMOVE_CATEGORY_FAVORITE:
    case favoriteActions.REMOVE_USER_FAVORITE:
      return state.filter(item => item !== action.payload);
    default:
      return state;
  }
};

const favorites = (state = initialState, action) => {
  switch (action.type) {
    case favoriteActions.ADD_CATEGORY_FAVORITE:
    case favoriteActions.REMOVE_CATEGORY_FAVORITE:
      return {
        ...state,
        categories: favoriteItem(state.categories, action),
      };
    case favoriteActions.ADD_USER_FAVORITE:
    case favoriteActions.REMOVE_USER_FAVORITE:
      return {
        ...state,
        users: favoriteItem(state.users, action),
      };
    case favoriteActions.SET_FAVORITE_OBJECT_TYPES.START: {
      return {
        ...state,
        loadingObjectTypes: true,
        // loadingObjects:  true,
      };
    }
    case favoriteActions.SET_FAVORITE_OBJECT_TYPES.SUCCESS: {
      return {
        ...state,
        favoriteObjectTypes: action.payload,
        loadingObjectTypes: false,
        loadingObjects: !isEmpty(action.payload),
      };
    }
    case favoriteActions.SET_FAVORITE_OBJECT_TYPES.ERROR: {
      return {
        ...state,
        favoriteObjectTypes: [],
        loadingObjectTypes: false,
        loadingObjects: false,
      };
    }
    case favoriteActions.SET_FAVORITE_OBJECTS.START: {
      return {
        ...state,
        loadingObjects: true,
      };
    }
    case favoriteActions.SET_FAVORITE_OBJECTS.SUCCESS: {
      return {
        ...state,
        favoriteObjects: { [action.meta]: action.payload.result },
        hasMore: action.payload.hasMore,
        loadingObjects: false,
      };
    }
    case favoriteActions.SET_FAVORITE_OBJECTS.ERROR: {
      return {
        ...state,
        favoriteObjects: {},
        loadingObjects: false,
        hasMore: false,
      };
    }
    case favoriteActions.SET_MORE_FAVORITE_OBJECTS.START: {
      return {
        ...state,
        loadingObjects: true,
      };
    }
    case favoriteActions.SET_MORE_FAVORITE_OBJECTS.SUCCESS: {
      return {
        ...state,
        favoriteObjects: {
          ...state.favoriteObjects,
          [action.meta]: [...state.favoriteObjects[action.meta], ...action.payload.result],
        },
        hasMore: action.payload.hasMore,
        loadingObjects: false,
      };
    }
    case favoriteActions.SET_MORE_FAVORITE_OBJECTS.ERROR: {
      return {
        ...state,
        loadingObjects: false,
        hasMore: false,
      };
    }
    case favoriteActions.RESET_FAVORITES: {
      return {
        ...state,
        favoriteObjectTypes: null,
        favoriteObjects: null,
        loadingObjects: false,
        loadingObjectTypes: false,
      };
    }
    // case favoriteActions.SET_LOADING_FAVORITES:{
    //   return {
    //     ...state,
    //     loadingObjects: action.payload,
    // }}
    default:
      return state;
  }
};

export default favorites;

export const getFavoriteCategories = state => state.categories;
