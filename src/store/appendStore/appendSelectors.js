import { createSelector } from 'reselect';

// selector
export const appendState = state => state.append;

// eslint-disable-next-line import/prefer-default-export
export const getIsAppendLoading = createSelector([appendState], state => state.loading);
export const getIsAddingAppendLoading = createSelector([appendState], state => state.addingAppend);

export const getAppendHasMore = createSelector([appendState], state => state.hasMore);

export const getAppendList = createSelector([appendState], state => state.fields);

export const getAbortController = createSelector([appendState], state => state.controller);

export const getAuthorityList = createSelector([appendState], state => state.authorityList);
