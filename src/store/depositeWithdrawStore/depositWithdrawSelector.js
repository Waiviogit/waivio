import { createSelector } from 'reselect';

// selector
export const depositWithdrawState = state => state.depositWithdraw;

// reselect function
export const getDepositList = createSelector([depositWithdrawState], state => state.depositPairs);

export const getWithdrawList = createSelector([depositWithdrawState], state => state.withdrawPairs);

export const getSelectPair = createSelector([depositWithdrawState], state => state.pair);

export const getIsOpenWithdraw = createSelector(
  [depositWithdrawState],
  state => state.isOpenWithdraw,
);

export const getWithdrawSelectPair = createSelector(
  [depositWithdrawState],
  state => state.withdrawPair,
);

export const getPairLoading = createSelector([depositWithdrawState], state => state.pairLoading);
