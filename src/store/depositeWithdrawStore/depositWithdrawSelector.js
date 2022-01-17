import { createSelector } from 'reselect';

// selector
export const depositWithdrawState = state => state.depositWithdraw;

// reselect function
export const getDepositList = createSelector([depositWithdrawState], state => state.depositPair);

export const getWithdrawList = createSelector([depositWithdrawState], state => state.withdrawPair);

export const getSelectPair = createSelector([depositWithdrawState], state => state.pair);
