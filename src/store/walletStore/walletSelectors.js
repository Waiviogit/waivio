import { last, get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const walletState = state => state.wallet;

// reselect function

export const getIsTransferVisible = createSelector([walletState], state => state.transferVisible);

export const getTransferTo = createSelector([walletState], state => state.transferTo);

export const getTransferAmount = createSelector([walletState], state => state.amount);

export const getTransferCurrency = createSelector([walletState], state => state.currency);

export const getTransferMemo = createSelector([walletState], state => state.memo);

export const getTransferApp = createSelector([walletState], state => state.app);

export const getIsVipTickets = createSelector([walletState], state => state.isVipTicket);

export const getTransferIsTip = createSelector([walletState], state => state.isTip);

export const getIsPowerUpOrDownVisible = createSelector(
  [walletState],
  state => state.powerUpOrDownVisible,
);

export const getIsPowerDown = createSelector([walletState], state => state.powerDown);

export const getStatusWithdraw = createSelector([walletState], state => state.withdrawOpen);

export const hasMoreGuestActions = createSelector(
  [walletState],
  state => state.hasMoreGuestActions,
);

export const getIsErrorLoading = createSelector([walletState], state => state.isErrorLoading);

export const getIsErrorLoadingTable = createSelector(
  [walletState],
  state => state.isErrorLoadingTableTransactions,
);

export const getOperationNum = createSelector([walletState], state => state.operationNum);

export const getTableOperationNum = createSelector([walletState], state => state.operationNumTable);

export const getIsloadingMoreTransactions = createSelector(
  [walletState],
  state => state.loadingMoreTransactions,
);

export const getIsloadingMoreTableTransactions = createSelector(
  [walletState],
  state => state.loadingMoreTableTransactions,
);

export const getIsloadingTableTransactions = createSelector(
  [walletState],
  state => state.tableTransactionsHistoryLoading,
);

export const getIsOpenWalletTable = createSelector([walletState], state => state.isOpenWalletTable);

export const getIsTransactionsHistoryLoading = createSelector(
  [walletState],
  state => state.transactionsHistoryLoading,
);

export const getTotalVestingShares = createSelector(
  [walletState],
  state => state.totalVestingShares,
);

export const getTotalVestingFundSteem = createSelector(
  [walletState],
  state => state.totalVestingFundSteem,
);

export const getUsersTransactions = createSelector([walletState], state => state.usersTransactions);

export const getTransactions = createSelector([walletState], state => state.transactionsHistory);

export const getTableTransactions = createSelector(
  [walletState],
  state => state.tableTransactionsHistory,
);

export const getUserHasMore = createSelector([walletState], state => state.hasMore);

export const getUserHasMoreTable = createSelector([walletState], state => state.hasMoreTable);

export const getUsersAccountHistory = createSelector(
  [walletState],
  state => state.usersAccountHistory,
);

export const getUsersAccountHistoryLoading = createSelector(
  [walletState],
  state => state.usersAccountHistoryLoading,
);

export const getUsersEstAccountsValues = createSelector(
  [walletState],
  state => state.usersEstAccountsValues,
);

export const getLoadingEstAccountValue = createSelector(
  [walletState],
  state => state.loadingEstAccountValue,
);

export const getLoadingGlobalProperties = createSelector(
  [walletState],
  state => state.loadingGlobalProperties,
);

export const getLoadingMoreUsersAccountHistory = createSelector(
  [walletState],
  state => state.loadingMoreUsersAccountHistory,
);

export const getUserHasMoreAccountHistory = createSelector(
  getUsersAccountHistory,
  (state, username) => username,
  (state, username) => {
    const lastAction = last(state[username]) || {};

    return lastAction.actionCount !== 1 && lastAction.actionCount !== 0;
  },
);

export const getAccountHistoryFilter = createSelector(
  [walletState],
  state => state.accountHistoryFilter,
);

export const getCurrentDisplayedActions = createSelector(
  [walletState],
  state => state.currentDisplayedActions,
);

export const getCurrentFilteredActions = createSelector(
  [walletState],
  state => state.currentFilteredActions,
);

export const getCurrentDeposits = createSelector([walletState], state => state.deposits);

export const getCurrentWithdrawals = createSelector([walletState], state => state.withdrawals);

export const getCurrentWalletType = createSelector([walletState], state => state.currentWallet);

export const getWaivTransactionHistoryFromState = createSelector(
  [walletState],
  state => state.waivTransactionHistory,
);

export const getTokenRatesInUSD = (state, token) => {
  const wallet = walletState(state);

  return get(wallet.tokensRates, `${token}.current.rates.USD`);
};
