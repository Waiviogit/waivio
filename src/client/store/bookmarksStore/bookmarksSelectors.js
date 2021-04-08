import { createSelector } from 'reselect';

// selector
export const bookmarksState = state => state.bookmarks;

// reselect function
export const getBookmarks = createSelector([bookmarksState], state => state.list);

export const getPendingBookmarks = createSelector(
  [bookmarksState],
  state => state.pendingBookmarks,
);
