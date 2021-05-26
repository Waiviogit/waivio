import { createSelector } from 'reselect';

// selector
export const reportsState = state => state.advancedReports;

// eslint-disable-next-line import/prefer-default-export
export const getTransactions = createSelector([reportsState], state => state.wallet);
export const getTransactionsHasMore = createSelector([reportsState], state => state.hasMore);
export const getTransfersAccounts = createSelector([reportsState], state => state.accounts);
export const getTransfersLoading = createSelector([reportsState], state => state.isLoading);
