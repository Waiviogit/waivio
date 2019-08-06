import * as bookmarksActions from './bookmarksActions';
import { GET_USER_METADATA } from '../user/usersActions';
import { GET_BOOKMARKS } from '../feed/feedActions';

const initialState = {
  list: [],
  pendingBookmarks: [],
  loading: false,
};

const bookmarks = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_METADATA.START:
    case GET_BOOKMARKS.START:
      return { ...state, loading: true };
    case GET_BOOKMARKS.SUCCESS:
    case GET_BOOKMARKS.ERROR:
    case GET_USER_METADATA.ERROR:
      return { ...state, loading: false };
    case GET_USER_METADATA.SUCCESS:
      if (action.payload && action.payload.bookmarks) {
        return {
          ...state,
          list: action.payload.bookmarks,
          loading: false,
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
export const getIsLoading = state => state.loading;
