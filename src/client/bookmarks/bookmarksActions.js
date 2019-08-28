import { toggleBookmarkMetadata } from '../helpers/metadata';
import { getAuthenticatedUserName } from '../reducers';

export const TOGGLE_BOOKMARK = '@bookmarks/TOGGLE_BOOKMARK';
export const TOGGLE_BOOKMARK_START = '@bookmarks/TOGGLE_BOOKMARK_START';
export const TOGGLE_BOOKMARK_SUCCESS = '@bookmarks/TOGGLE_BOOKMARK_SUCCESS';
export const TOGGLE_BOOKMARK_ERROR = '@bookmarks/TOGGLE_BOOKMARK_ERROR';

export const toggleBookmark = postId => (dispatch, getState) => {
  const state = getState();
  const userName = getAuthenticatedUserName(state);
  if (!userName) return dispatch({ type: TOGGLE_BOOKMARK_ERROR });
  return dispatch({
    type: TOGGLE_BOOKMARK,
    payload: {
      promise: toggleBookmarkMetadata(userName, postId),
    },
    meta: { id: postId },
  });
};
