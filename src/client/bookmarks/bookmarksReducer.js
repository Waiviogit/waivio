import * as bookmarksActions from './bookmarksActions';
import { GET_USER_METADATA } from '../user/usersActions';

const initialState = {
  list: [],
  pendingBookmarks: [],
};

const bookmarks = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
};

export default bookmarks;

export const getBookmarks = state => state.list;
export const getPendingBookmarks = state => state.pendingBookmarks;
