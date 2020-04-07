import {
  getTransferTo,
  getIsPowerDown,
  getTransferMemo,
  getTransferAmount,
  getTransferCurrency,
  getGuestUserBalance,
  getIsTransferVisible,
  getUsersTransactions,
  getTotalVestingShares,
  getUsersAccountHistory,
  getAccountHistoryFilter,
  getTotalVestingFundSteem,
  getUsersEstAccountsValues,
  getLoadingEstAccountValue,
  getCurrentFilteredActions,
  getIsPowerUpOrDownVisible,
  getLoadingGlobalProperties,
  getCurrentDisplayedActions,
  getUserHasMoreAccountHistory,
  getUsersAccountHistoryLoading,
  getLoadingMoreUsersAccountHistory,
} from '../../reducers';

jest.mock('../../vendor/steemitHelpers.js', () => {});

describe('fromWallet', () => {
  const username = 'username';
  const state = {
    wallet: {
      transferVisible: 'transferVisible',
      transferTo: 'transferTo',
      amount: 'amount',
      currency: 'currency',
      memo: 'memo',
      powerUpOrDownVisible: 'powerUpOrDownVisible',
      powerDown: 'powerDown',
      totalVestingShares: 'totalVestingShares',
      totalVestingFundSteem: 'totalVestingFundSteem',
      usersTransactions: 'usersTransactions',
      usersEstAccountsValues: 'usersEstAccountsValues',
      usersAccountHistoryLoading: 'usersAccountHistoryLoading',
      loadingEstAccountValue: 'loadingEstAccountValue',
      loadingGlobalProperties: 'loadingGlobalProperties',
      usersAccountHistory: {
        'user-username': [
          {},
          {},
          {
            actionCount: 2,
          },
        ],
      },
      loadingMoreUsersAccountHistory: 'loadingMoreUsersAccountHistory',
      accountHistoryFilter: 'accountHistoryFilter',
      currentDisplayedActions: 'currentDisplayedActions',
      currentFilteredActions: 'currentFilteredActions',
      balance: 'balance',
    },
  };

  it('Should return transferVisible', () => {
    expect(getIsTransferVisible(state)).toEqual('transferVisible');
  });

  it('Should return transferTo', () => {
    expect(getTransferTo(state)).toEqual('transferTo');
  });

  it('Should return amount', () => {
    expect(getTransferAmount(state)).toEqual('amount');
  });

  it('Should return currency', () => {
    expect(getTransferCurrency(state)).toEqual('currency');
  });

  it('Should return memo', () => {
    expect(getTransferMemo(state)).toEqual('memo');
  });

  it('Should return powerUpOrDownVisible', () => {
    expect(getIsPowerUpOrDownVisible(state)).toEqual('powerUpOrDownVisible');
  });

  it('Should return powerDown', () => {
    expect(getIsPowerDown(state)).toEqual('powerDown');
  });

  it('Should return totalVestingShares', () => {
    expect(getTotalVestingShares(state)).toEqual('totalVestingShares');
  });

  it('Should return totalVestingFundSteem', () => {
    expect(getTotalVestingFundSteem(state)).toEqual('totalVestingFundSteem');
  });

  it('Should return usersTransactions', () => {
    expect(getUsersTransactions(state)).toEqual('usersTransactions');
  });

  it('Should return usersAccountHistory', () => {
    expect(getUsersAccountHistory(state)).toEqual(state.wallet.usersAccountHistory);
  });

  it('Should return usersAccountHistoryLoading', () => {
    expect(getUsersAccountHistoryLoading(state)).toEqual('usersAccountHistoryLoading');
  });

  it('Should return usersEstAccountsValues', () => {
    expect(getUsersEstAccountsValues(state)).toEqual('usersEstAccountsValues');
  });

  it('Should return loadingEstAccountValue', () => {
    expect(getLoadingEstAccountValue(state)).toEqual('loadingEstAccountValue');
  });

  it('Should return loadingGlobalProperties', () => {
    expect(getLoadingGlobalProperties(state)).toEqual('loadingGlobalProperties');
  });

  it('Should return loadingMoreUsersAccountHistory', () => {
    expect(getLoadingMoreUsersAccountHistory(state)).toEqual('loadingMoreUsersAccountHistory');
  });

  it('Should return loadingMoreUsersAccountHistory', () => {
    expect(getUserHasMoreAccountHistory(state, username)).toEqual(true);
  });

  it('Should return loadingMoreUsersAccountHistory', () => {
    state.wallet.usersAccountHistory['user-username'][2].actionCount = 1;
    expect(getUserHasMoreAccountHistory(state, username)).toEqual(false);
  });

  it('Should return accountHistoryFilter', () => {
    expect(getAccountHistoryFilter(state)).toEqual('accountHistoryFilter');
  });

  it('Should return currentDisplayedActions', () => {
    expect(getCurrentDisplayedActions(state)).toEqual('currentDisplayedActions');
  });

  it('Should return currentFilteredActions', () => {
    expect(getCurrentFilteredActions(state)).toEqual('currentFilteredActions');
  });

  it('Should return balance', () => {
    expect(getGuestUserBalance(state)).toEqual('balance');
  });
});
