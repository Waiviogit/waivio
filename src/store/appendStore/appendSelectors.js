import { createSelector } from 'reselect';

// selector
export const appendState = state => state.append;

// eslint-disable-next-line import/prefer-default-export
export const getIsAppendLoading = createSelector([appendState], state => state.loading);
