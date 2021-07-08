import {
  getAccountHistoryFilter,
  getCurrentDisplayedActions,
  getCurrentFilteredActions,
  getIsPowerDown,
  getIsPowerUpOrDownVisible,
  getIsTransferVisible,
  getLoadingEstAccountValue,
  getLoadingGlobalProperties,
  getLoadingMoreUsersAccountHistory,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getTransferAmount,
  getTransferCurrency,
  getTransferMemo,
  getTransferTo,
  getUserHasMoreAccountHistory,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersEstAccountsValues,
  getUsersTransactions,
} from '../../../store/walletStore/walletSelectors';

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
      usersAccountHistory: { username: [{ actionCount: 0 }] },
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

  it('Should return getLoadingMoreUsersAccountHistory', () => {
    expect(getLoadingMoreUsersAccountHistory(state)).toEqual('loadingMoreUsersAccountHistory');
  });

  it('Should return loadingMoreUsersAccountHistory if actionCount === 0', () => {
    expect(getUserHasMoreAccountHistory(state, username)).toEqual(false);
  });

  it('Should return loadingMoreUsersAccountHistory if actionCount === 2', () => {
    const currState = { wallet: { usersAccountHistory: { username: [{ actionCount: 2 }] } } };

    expect(getUserHasMoreAccountHistory(currState, username)).toEqual(true);
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
});
