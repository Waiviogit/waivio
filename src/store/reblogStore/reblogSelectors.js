import { createSelector } from 'reselect';

// selector
export const reblogState = state => state.reblog;

// reselect function
export const getRebloggedList = createSelector([reblogState], state => state.rebloggedList);
export const getPendingReblogs = createSelector([reblogState], state => state.pendingReblogs);
