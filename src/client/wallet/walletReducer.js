import { get, slice, filter, concat, last, uniqWith, isEqual } from 'lodash';
import * as walletActions from './walletActions';
import { actionsFilter, ACTIONS_DISPLAY_LIMIT } from '../helpers/accountHistoryHelper';

const initialState = {
  transferVisible: false,
  transferTo: '',
  powerUpOrDownVisible: false,
  powerDown: false,
  totalVestingShares: '',
  totalVestingFundSteem: '',
  usersTransactions: {},
  usersAccountHistory: {},
  usersEstAccountsValues: {},
  usersAccountHistoryLoading: true,
  loadingEstAccountValue: true,
  loadingGlobalProperties: true,
  loadingMoreUsersAccountHistory: false,
  accountHistoryFilter: [],
  currentDisplayedActions: [],
  currentFilteredActions: [],
  transactionsHistory: {},
  tableTransactionsHistory: {},
  loadingMoreTransactions: false,
  loadingMoreTableTransactions: false,
  hasMore: false,
  hasMoreTable: false,
  hasMoreGuestActions: false,
  transactionsHistoryLoading: false,
  tableTransactionsHistoryLoading: false,
  withdrawOpen: false,
  isErrorLoading: false,
  isErrorLoadingTableTransactions: false,
  operationNum: -1,
  operationNumTable: -1,
  isOpenWalletTable: false,
};

export default function walletReducer(state = initialState, action) {
  switch (action.type) {
    case walletActions.OPEN_TRANSFER:
      return {
        ...state,
        transferVisible: true,
        transferTo: action.payload.userName,
        amount: action.payload.amount,
        currency: action.payload.currency,
        memo: action.payload.memo,
        app: action.payload.app,
      };
    case walletActions.CLOSE_TRANSFER:
      return {
        ...state,
        transferVisible: false,
        amount: null,
      };
    case walletActions.OPEN_POWER_UP_OR_DOWN:
      return {
        ...state,
        powerUpOrDownVisible: true,
        powerDown: !!action.payload,
      };
    case walletActions.CLOSE_POWER_UP_OR_DOWN:
      return {
        ...state,
        powerUpOrDownVisible: false,
      };
    case walletActions.GET_GLOBAL_PROPERTIES.START:
      return {
        ...state,
        loadingGlobalProperties: true,
      };
    case walletActions.GET_GLOBAL_PROPERTIES.SUCCESS: {
      return {
        ...state,
        totalVestingFundSteem: action.payload.total_vesting_fund_hive,
        totalVestingShares: action.payload.total_vesting_shares,
        loadingGlobalProperties: false,
      };
    }
    case walletActions.GET_GLOBAL_PROPERTIES.ERROR: {
      return {
        ...state,
        loadingGlobalProperties: false,
      };
    }
    case walletActions.GET_USER_ACCOUNT_HISTORY.START:
      return {
        ...state,
        usersAccountHistoryLoading: true,
      };
    case walletActions.GET_USER_ACCOUNT_HISTORY.SUCCESS: {
      const usernameKey = action.payload.username;
      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [usernameKey]: action.payload.userWalletTransactions,
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [usernameKey]: action.payload.userAccountHistory,
        },
        hasMoreGuestActions: action.payload.hasMoreGuestActions,
        usersAccountHistoryLoading: false,
      };
    }
    case walletActions.GET_USER_ACCOUNT_HISTORY.ERROR:
      return {
        ...state,
        usersAccountHistoryLoading: false,
      };
    case walletActions.GET_TRANSACTIONS_HISTORY.START:
      return {
        ...state,
        transactionsHistoryLoading: true,
      };
    case walletActions.GET_TRANSACTIONS_HISTORY.SUCCESS: {
      const usernameKey = action.payload.username;
      return {
        ...state,
        transactionsHistory: {
          ...state.transactionsHistory,
          [usernameKey]: action.payload.transactionsHistory,
        },
        hasMore: action.payload.hasMore,
        operationNum: action.payload.operationNum,
        transactionsHistoryLoading: false,
      };
    }
    case walletActions.GET_TABLE_TRANSACTIONS_HISTORY.START:
      return {
        ...state,
        tableTransactionsHistoryLoading: true,
      };
    case walletActions.GET_TABLE_TRANSACTIONS_HISTORY.SUCCESS: {
      const usernameKey = action.payload.username;
      return {
        ...state,
        tableTransactionsHistory: {
          ...state.tableTransactionsHistory,
          [usernameKey]: action.payload.tableTransactionsHistory,
        },
        hasMoreTable: action.payload.hasMoreTable,
        operationNumTable: action.payload.operationNumTable,
        tableTransactionsHistoryLoading: false,
      };
    }
    case walletActions.GET_MORE_TRANSACTIONS_HISTORY.START:
      return {
        ...state,
        loadingMoreTransactions: true,
      };
    case walletActions.GET_MORE_TRANSACTIONS_HISTORY.SUCCESS: {
      const usernameKey = action.payload.username;
      const userCurrentTransactions = get(state.transactionsHistory, usernameKey, []);
      return {
        ...state,
        transactionsHistory: {
          ...state.transactionsHistory,
          [usernameKey]: uniqWith(
            userCurrentTransactions.concat(action.payload.transactionsHistory),
            isEqual,
          ),
        },
        hasMore: action.payload.hasMore,
        operationNum: action.payload.operationNum,
        loadingMoreTransactions: false,
        isErrorLoading: false,
      };
    }
    case walletActions.GET_MORE_TRANSACTIONS_HISTORY.ERROR:
      return {
        loadingMoreTransactions: false,
      };

    case walletActions.GET_MORE_TABLE_TRANSACTIONS_HISTORY.START:
      return {
        ...state,
        loadingMoreTableTransactions: true,
      };
    case walletActions.GET_MORE_TABLE_TRANSACTIONS_HISTORY.SUCCESS: {
      const usernameKey = action.payload.username;
      const userCurrentTransactions = get(state.tableTransactionsHistory, usernameKey, []);
      return {
        ...state,
        tableTransactionsHistory: {
          ...state.tableTransactionsHistory,
          [usernameKey]: uniqWith(
            userCurrentTransactions.concat(action.payload.tableTransactionsHistory),
            isEqual,
          ),
        },
        hasMoreTable: action.payload.hasMoreTable,
        operationNumTable: action.payload.operationNumTable,
        loadingMoreTableTransactions: false,
        isErrorLoadingTableTransactions: false,
      };
    }
    case walletActions.GET_MORE_TABLE_TRANSACTIONS_HISTORY.ERROR:
      return {
        loadingMoreTableTransactions: false,
      };
    case walletActions.GET_TRANSACTIONS_HISTORY.ERROR:
      return {
        transactionsHistoryLoading: false,
      };
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.START:
      return {
        ...state,
        loadingMoreUsersAccountHistory: true,
      };
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.SUCCESS: {
      const usernameKey = action.payload.username;
      const userCurrentWalletTransactions = get(state.usersTransactions, usernameKey, []);
      const userCurrentAccountHistory = get(state.usersAccountHistory, usernameKey, []);

      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [usernameKey]: uniqWith(
            userCurrentWalletTransactions.concat(action.payload.userWalletTransactions),
            isEqual,
          ),
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [usernameKey]: uniqWith(
            userCurrentAccountHistory.concat(action.payload.userAccountHistory),
            isEqual,
          ),
        },
        hasMoreGuestActions: action.payload.hasMoreGuestActions,
        loadingMoreUsersAccountHistory: false,
      };
    }
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.ERROR:
      return {
        ...state,
        loadingMoreUsersAccountHistory: false,
      };
    case walletActions.CLEAR_TRANSACTIONS_HISTORY:
      return {
        ...state,
        hasMore: false,
        operationNum: -1,
        transactionsHistory: {},
      };
    case walletActions.CLEAR_TABLE_TRANSACTIONS_HISTORY:
      return {
        ...state,
        hasMoreTable: false,
        operationNum: -1,
        tableTransactionsHistory: {},
      };
    case walletActions.OPEN_WALLET_TABLE:
      return {
        ...state,
        isOpenWalletTable: true,
      };
    case walletActions.CLOSE_WALLET_TABLE:
      return {
        ...state,
        isOpenWalletTable: false,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.START:
      return {
        ...state,
        loadingEstAccountValue: true,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.SUCCESS:
      return {
        ...state,
        usersEstAccountsValues: {
          ...state.usersEstAccountsValues,
          [action.payload.username]: action.payload.value,
        },
        loadingEstAccountValue: false,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.ERROR:
      return {
        ...state,
        loadingEstAccountValue: false,
      };
    case walletActions.UPDATE_ACCOUNT_HISTORY_FILTER: {
      const usernameKey = action.payload.username;
      const currentUserActions = state.usersAccountHistory[usernameKey];
      const initialActions = slice(currentUserActions, 0, ACTIONS_DISPLAY_LIMIT);
      const initialFilteredActions = filter(initialActions, userAction =>
        actionsFilter(userAction, action.payload.accountHistoryFilter, action.payload.username),
      );
      return {
        ...state,
        accountHistoryFilter: action.payload.accountHistoryFilter,
        currentDisplayedActions: initialActions,
        currentFilteredActions: initialFilteredActions,
      };
    }
    case walletActions.SET_INITIAL_CURRENT_DISPLAYED_ACTIONS: {
      const currentUserActions = state.usersAccountHistory[action.payload];
      return {
        ...state,
        currentDisplayedActions: slice(currentUserActions, 0, ACTIONS_DISPLAY_LIMIT),
      };
    }
    case walletActions.ADD_MORE_ACTIONS_TO_CURRENT_DISPLAYED_ACTIONS:
      return {
        ...state,
        currentDisplayedActions: concat(state.currentDisplayedActions, action.payload.moreActions),
        currentFilteredActions: concat(
          state.currentFilteredActions,
          action.payload.filteredMoreActions,
        ),
        loadingMoreUsersAccountHistory: false,
      };
    case walletActions.UPDATE_FILTERED_ACTIONS:
      return {
        ...state,
        currentFilteredActions: action.payload,
      };
    case walletActions.LOADING_MORE_USERS_ACCOUNT_HISTORY:
      return {
        ...state,
        loadingMoreUsersAccountHistory: true,
      };
    case walletActions.OPEN_WITHDRAW:
      return {
        ...state,
        withdrawOpen: true,
      };
    case walletActions.CLOSE_WITHDRAW:
      return {
        ...state,
        withdrawOpen: false,
      };
    case walletActions.GET_ERROR_LOADING_TRANSACTIONS:
      return {
        ...state,
        isErrorLoading: true,
      };
    case walletActions.GET_ERROR_LOADING_TABLE_TRANSACTIONS:
      return {
        ...state,
        isErrorLoadingTableTransactions: true,
      };
    default:
      return state;
  }
}

export const getIsTransferVisible = state => state.transferVisible;
export const getTransferTo = state => state.transferTo;
export const getTransferAmount = state => state.amount;
export const getTransferCurrency = state => state.currency;
export const getTransferMemo = state => state.memo;
export const getTransferApp = state => state.app;
export const getIsPowerUpOrDownVisible = state => state.powerUpOrDownVisible;
export const getIsPowerDown = state => state.powerDown;
export const getTotalVestingShares = state => state.totalVestingShares;
export const getTotalVestingFundSteem = state => state.totalVestingFundSteem;
export const getUsersTransactions = state => state.usersTransactions;
export const getTransactions = state => state.transactionsHistory;
export const getTableTransactions = state => state.tableTransactionsHistory;
export const getUserHasMore = state => state.hasMore;
export const getUserHasMoreTable = state => state.hasMoreTable;
export const getUsersEstAccountsValues = state => state.usersEstAccountsValues;
export const getUsersAccountHistoryLoading = state => state.usersAccountHistoryLoading;
export const getLoadingEstAccountValue = state => state.loadingEstAccountValue;
export const getLoadingGlobalProperties = state => state.loadingGlobalProperties;
export const getUsersAccountHistory = state => state.usersAccountHistory;
export const getLoadingMoreUsersAccountHistory = state => state.loadingMoreUsersAccountHistory;
export const getUserHasMoreAccountHistory = (state, username) => {
  const lastAction = last(state.usersAccountHistory[username]) || {};
  return lastAction.actionCount !== 1 && lastAction.actionCount !== 0;
};
export const getAccountHistoryFilter = state => state.accountHistoryFilter;
export const getCurrentDisplayedActions = state => state.currentDisplayedActions;
export const getCurrentFilteredActions = state => state.currentFilteredActions;
export const getStatusWithdraw = state => state.withdrawOpen;
export const hasMoreGuestActions = state => state.hasMoreGuestActions;
export const getIsErrorLoading = state => state.isErrorLoading;
export const getIsErrorLoadingTable = state => state.isErrorLoadingTableTransactions;
export const getOperationNum = state => state.operationNum;
export const getTableOperationNum = state => state.operationNumTable;
export const getIsloadingMoreTransactions = state => state.loadingMoreTransactions;
export const getIsloadingMoreTableTransactions = state => state.loadingMoreTableTransactions;
export const getIsloadingTableTransactions = state => state.tableTransactionsHistoryLoading;
export const getIsOpenWalletTable = state => state.isOpenWalletTable;
