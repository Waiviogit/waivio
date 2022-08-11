import { last, get } from 'lodash';
import moment from 'moment';
import { createSelector } from 'reselect';
import { CRYPTO_MAP } from '../../common/constants/cryptos';
import { getLocale } from '../settingsStore/settingsSelectors';

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

export const getDelegationModalType = createSelector(
  [walletState],
  state => state.delegationModalType,
);

export const getDelegationToken = createSelector([walletState], state => state.delegationToken);

export const getDelegationModalVisible = createSelector(
  [walletState],
  state => state.delegateVisible,
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

export const getUserBalanse = createSelector([walletState], state => state.userBalances);

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

export const getTokensBalanceListForTransfer = createSelector(
  [walletState],
  state => state.tokensBalanceListForTransfer,
);

export const getHiveEngineTransactionHistory = createSelector(
  [walletState],
  state => state.hiveEngineTransactionHistory.list,
);

export const getHasMoreHiveEngineTransactionHistory = createSelector(
  [walletState],
  state => state.hiveEngineTransactionHistory.hasMore,
);

export const getHiveEngineDelayInfo = createSelector(
  [walletState],
  state => state.hiveEngineDelayInfo,
);

export const getTokensBalanceList = createSelector([walletState], state => state.tokensBalanceList);

export const getSwapTokensBalanceList = createSelector(
  [walletState],
  state => state.swapTokensBalanceList,
);

export const getWaivTransactionHistoryFromState = createSelector(
  [walletState],
  state => state.waivTransactionHistory,
);

export const getTokenRatesInUSD = (state, token) => {
  const wallet = walletState(state);

  return get(wallet.tokensRates, [CRYPTO_MAP[token].coinGeckoId, 'current', 'rates', 'USD']);
};

export const getTokenRatesInSelectCurrency = (state, token, currency) => {
  const wallet = walletState(state);

  return get(wallet.tokensRates, [CRYPTO_MAP[token].coinGeckoId, 'current', 'rates', currency]);
};
export const getTokenRatesInUSDChanged = (state, token) => {
  const wallet = walletState(state);

  return get(wallet.tokensRates, [CRYPTO_MAP[token].coinGeckoId, 'current', 'change24h', 'USD']);
};

export const getTokenRatesInSelectCurrencyChanged = (state, token, currency) => {
  const wallet = walletState(state);

  return get(wallet.tokensRates, [CRYPTO_MAP[token].coinGeckoId, 'current', 'change24h', currency]);
};

export const getDepositVisible = createSelector([walletState], state => state.depositVisible);

export const getShowRewards = createSelector([walletState], state => state.showRewards);

// get weekle price for chart
export const getWeeklyTokenRatesPrice = (state, token) => {
  const wallet = walletState(state);
  const locale = getLocale(state);

  return get(wallet.tokensRates, [CRYPTO_MAP[token].coinGeckoId, 'weekly'], []).map(price => ({
    price: price.rates.USD,
    day: moment
      .utc(price.dateString)
      .locale(locale)
      .format('ddd'),
  }));
};

// get weekle price for chart
export const getUserCurrencyBalance = (state, token) => {
  const wallet = walletState(state);

  return get(wallet.userBalances, token, null);
};
