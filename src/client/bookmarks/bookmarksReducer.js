import { get } from 'lodash';
import * as authActions from '../auth/authActions';
import * as bookmarksActions from './bookmarksActions';
import { GET_USER_METADATA } from '../user/usersActions';
import { LOGOUT } from "../auth/authActions";

const initialState = {
  list: [],
  pendingBookmarks: [],
};

const bookmarks = (state = initialState, action) => {
  switch (action.type) {
    case authActions.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;
      return {
        ...state,
        list: get(action, ['payload', 'userMetaData', 'bookmarks'], initialState.list),
      };
    case GET_USER_METADATA.SUCCESS:
      if (action.payload && action.payload.bookmarks) {
        return {
          ...state,
          list: action.payload.bookmarks,
        };
      }
      return state;
    case bookmarksActions.TOGGLE_BOOKMARK_START:
      return {
        ...state,
        pendingBookmarks: [...state.pendingBookmarks, action.meta.id],
      };
    case bookmarksActions.TOGGLE_BOOKMARK_SUCCESS:
      return {
        ...state,
        list: action.payload || initialState.list,
        pendingBookmarks: state.pendingBookmarks.filter(bookmark => bookmark !== action.meta.id),
      };
    case bookmarksActions.TOGGLE_BOOKMARK_ERROR:
      return {
        ...state,
        pendingBookmarks: state.pendingBookmarks.filter(bookmark => bookmark !== action.meta.id),
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default bookmarks;

export const getBookmarks = state => state.list;
export const getPendingBookmarks = state => state.pendingBookmarks;
