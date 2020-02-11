import { concat, filter, get, last, slice, uniqBy } from 'lodash';
import * as walletActions from './walletActions';
import { ACTIONS_DISPLAY_LIMIT, actionsFilter } from '../helpers/accountHistoryHelper';
import { getUserDetailsKey } from '../helpers/stateHelpers';

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
      };
    case walletActions.CLOSE_TRANSFER:
      return {
        ...state,
        transferVisible: false,
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
        totalVestingFundSteem: action.payload.total_vesting_fund_steem,
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
      const usernameKey = getUserDetailsKey(action.payload.username);

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
        usersAccountHistoryLoading: false,
        balance: action.payload.balance,
      };
    }
    case walletActions.GET_USER_ACCOUNT_HISTORY.ERROR:
      return {
        ...state,
        usersAccountHistoryLoading: false,
      };
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.START:
      return {
        ...state,
        loadingMoreUsersAccountHistory: true,
      };
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.SUCCESS: {
      const usernameKey = getUserDetailsKey(action.payload.username);
      const userCurrentWalletTransactions = get(state.usersTransactions, usernameKey, []);
      const userCurrentAccountHistory = get(state.usersAccountHistory, usernameKey, []);

      return {
        ...state,
        usersTransactions: {
          ...state.usersTransactions,
          [usernameKey]: uniqBy(
            userCurrentWalletTransactions.concat(action.payload.userWalletTransactions),
            'actionCount',
          ),
        },
        usersAccountHistory: {
          ...state.usersAccountHistory,
          [usernameKey]: uniqBy(
            userCurrentAccountHistory.concat(action.payload.userAccountHistory),
            'actionCount',
          ),
        },
        loadingMoreUsersAccountHistory: false,
      };
    }
    case walletActions.GET_MORE_USER_ACCOUNT_HISTORY.ERROR:
      return {
        ...state,
        loadingMoreUsersAccountHistory: false,
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
          [getUserDetailsKey(action.payload.username)]: action.payload.value,
        },
        loadingEstAccountValue: false,
      };
    case walletActions.GET_USER_EST_ACCOUNT_VALUE.ERROR:
      return {
        ...state,
        loadingEstAccountValue: false,
      };
    case walletActions.UPDATE_ACCOUNT_HISTORY_FILTER: {
      const usernameKey = getUserDetailsKey(action.payload.username);
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
      const currentUserActions = state.usersAccountHistory[getUserDetailsKey(action.payload)];
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
    default:
      return state;
  }
}

export const getIsTransferVisible = state => state.transferVisible;
export const getTransferTo = state => state.transferTo;
export const getTransferAmount = state => state.amount;
export const getTransferCurrency = state => state.currency;
export const getTransferMemo = state => state.memo;
export const getIsPowerUpOrDownVisible = state => state.powerUpOrDownVisible;
export const getIsPowerDown = state => state.powerDown;
export const getTotalVestingShares = state => state.totalVestingShares;
export const getTotalVestingFundSteem = state => state.totalVestingFundSteem;
export const getUsersTransactions = state => state.usersTransactions;
export const getUsersEstAccountsValues = state => state.usersEstAccountsValues;
export const getUsersAccountHistoryLoading = state => state.usersAccountHistoryLoading;
export const getLoadingEstAccountValue = state => state.loadingEstAccountValue;
export const getLoadingGlobalProperties = state => state.loadingGlobalProperties;
export const getUsersAccountHistory = state => state.usersAccountHistory;
export const getLoadingMoreUsersAccountHistory = state => state.loadingMoreUsersAccountHistory;
export const getUserHasMoreAccountHistory = (state, username) => {
  const lastAction = last(state.usersAccountHistory[getUserDetailsKey(username)]) || {};
  return lastAction.actionCount !== 1 && lastAction.actionCount !== 0;
};
export const getAccountHistoryFilter = state => state.accountHistoryFilter;
export const getCurrentDisplayedActions = state => state.currentDisplayedActions;
export const getCurrentFilteredActions = state => state.currentFilteredActions;
export const getGuestUserBalance = state => state.balance;
