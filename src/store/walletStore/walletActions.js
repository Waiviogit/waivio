import { each, get, last, findIndex, isEmpty, filter } from 'lodash';
import { createAction } from 'redux-actions';
import formatter from '../../common/helpers/steemitFormatter';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import {
  getAccountHistory,
  getDynamicGlobalProperties,
  isWalletTransaction,
  defaultAccountLimit,
} from '../../common/helpers/apiHelpers';
import { ACTIONS_DISPLAY_LIMIT, actionsFilter } from '../../common/helpers/accountHistoryHelper';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';
import { guestUserRegex } from '../../common/helpers/regexHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { getCurrentWalletType, getShowRewards } from './walletSelectors';
import { parseJSON } from '../../common/helpers/parseJSON';
import {
  HIVE_ENGINE_DEFAULT_SWAP_LIST,
  HIVE_ENGINE_DEFAULT_SWAP_LIST_ORDER_KEY,
} from '../../common/constants/swapList';
import delegationModalTypes from '../../common/constants/delegationModalTypes';
import { getGuestWaivBalance, getGuestWaivTransferHistory } from '../../waivioApi/walletApi';

export const OPEN_TRANSFER = '@wallet/OPEN_TRANSFER';
export const CLOSE_TRANSFER = '@wallet/CLOSE_TRANSFER';
export const OPEN_POWER_UP_OR_DOWN = '@wallet/OPEN_POWER_UP_OR_DOWN';
export const CLOSE_POWER_UP_OR_DOWN = '@wallet/CLOSE_POWER_UP_OR_DOWN';
export const GET_GLOBAL_PROPERTIES = createAsyncActionType('@wallet/GET_GLOBAL_PROPERTIES');
export const GET_USER_ACCOUNT_HISTORY = createAsyncActionType('@users/GET_USER_ACCOUNT_HISTORY');
export const GET_MORE_USER_ACCOUNT_HISTORY = createAsyncActionType(
  '@users/GET_MORE_USER_ACCOUNT_HISTORY',
);
export const GET_TRANSACTIONS_HISTORY = createAsyncActionType('@wallet/GET_TRANSACTIONS_HISTORY');
export const GET_TABLE_TRANSACTIONS_HISTORY = createAsyncActionType(
  '@wallet/GET_TABLE_TRANSACTIONS_HISTORY',
);
export const GET_MORE_TRANSACTIONS_HISTORY = createAsyncActionType(
  '@wallet/GET_MORE_TRANSACTIONS_HISTORY',
);
export const GET_MORE_TABLE_TRANSACTIONS_HISTORY = createAsyncActionType(
  '@wallet/GET_MORE_TABLE_TRANSACTIONS_HISTORY',
);

export const GET_USER_EST_ACCOUNT_VALUE = createAsyncActionType(
  '@users/GET_USER_EST_ACCOUNT_VALUE',
);
export const UPDATE_ACCOUNT_HISTORY_FILTER = '@users/UPDATE_ACCOUNT_HISTORY_FILTER';
export const SET_INITIAL_CURRENT_DISPLAYED_ACTIONS = '@users/SET_INITIAL_CURRENT_DISPLAYED_ACTIONS';
export const ADD_MORE_ACTIONS_TO_CURRENT_DISPLAYED_ACTIONS =
  '@users/ADD_MORE_ACTIONS_TO_CURRENT_DISPLAYED_ACTIONS';
export const UPDATE_FILTERED_ACTIONS = '@users/UPDATE_FILTERED_ACTIONS';
export const LOADING_MORE_USERS_ACCOUNT_HISTORY = '@users/LOADING_MORE_USERS_ACCOUNT_HISTORY';

export const closeTransfer = createAction(CLOSE_TRANSFER);

export const openPowerUpOrDown = createAction(OPEN_POWER_UP_OR_DOWN);
export const closePowerUpOrDown = createAction(CLOSE_POWER_UP_OR_DOWN);

export const SET_PENDING_TRANSFER = '@wallet/SET_PENDING_TRANSFER';

export const SET_IS_OLD = 'SET_IS_OLD';

export const setIsOld = payload => ({
  type: SET_IS_OLD,
  payload,
});

export const openTransfer = (
  userName,
  amount = 0,
  currency,
  memo = '',
  app,
  tip = false,
  isVipTicket = false,
) => (dispatch, getState) => {
  const walletType = getCurrentWalletType(getState());
  let currentCurrency = currency || 'HIVE';

  if (!currency && walletType === 'WAIV') currentCurrency = walletType;

  return dispatch({
    type: OPEN_TRANSFER,
    payload: {
      userName,
      amount,
      currency: currentCurrency,
      memo,
      app,
      tip,
      isVipTicket,
    },
  });
};

const parseSteemUserActions = userActions => {
  const userWalletTransactions = [];
  const userAccountHistory = [];

  each(userActions.reverse(), action => {
    const actionCount = action[0];
    const actionDetails = {
      ...action[1],
      actionCount,
    };
    const actionType = actionDetails.op[0];

    if (isWalletTransaction(actionType)) {
      userWalletTransactions.push(actionDetails);
    }

    userAccountHistory.push(actionDetails);
  });

  return {
    userWalletTransactions,
    userAccountHistory,
  };
};
const parseGuestActions = actions => {
  const guestActionType = {
    DEMO_POST: 'demo_post',
    GUEST_TRANSFER: 'user_to_guest_transfer',
    DEMO_DEBT: 'demo_debt',
  };

  return actions.map((action, index) => {
    const transferDirection = Object.values(guestActionType).includes(action.type)
      ? { from: action.sponsor, to: action.userName }
      : { from: action.userName, to: action.sponsor || 'mock' };

    return {
      trx_id: action._id,
      block: 39603148,
      trx_in_block: 1,
      op_in_trx: 0,
      virtual_op: 0,
      timestamp: action.createdAt.split('.')[0],
      withdraw: action.withdraw,
      op: [
        'transfer',
        {
          ...transferDirection,
          amount: `${action.amount} HIVE`,
          memo: action.memo || '',
          typeTransfer: action.type,
          details: action.details || null,
          username: action.userName,
          hbdUSD: action.hbdUSD,
          hiveUSD: action.hiveUSD,
          withdrawDeposit: action.withdrawDeposit,
        },
      ],
      actionCount: index + 1,
    };
  });
};
const getParsedUserActions = (userActions, isGuest) => {
  if (isGuest) {
    const userWalletTransactions = parseGuestActions(get(userActions, ['histories'], []));

    return {
      userWalletTransactions,
      userAccountHistory: userWalletTransactions.length
        ? userWalletTransactions
        : [{ actionCount: 0 }],
    };
  }

  return parseSteemUserActions(userActions);
};

export const getGlobalProperties = () => dispatch =>
  dispatch({
    type: GET_GLOBAL_PROPERTIES.ACTION,
    payload: {
      promise: getDynamicGlobalProperties(),
    },
  });

export const getMoreUserAccountHistory = (
  username,
  start,
  limit,
  tableView,
  startDate,
  endDate,
) => dispatch => {
  const isGuest = username.startsWith(GUEST_PREFIX) || username.startsWith(BXY_GUEST_PREFIX);

  return dispatch({
    type: GET_MORE_USER_ACCOUNT_HISTORY.ACTION,
    payload: {
      promise: getAccountHistory(
        username,
        { from: start, limit, isGuest },
        tableView,
        startDate,
        endDate,
      ).then(userActions => {
        const parsedUserActions = getParsedUserActions(userActions, isGuest);

        return {
          username,
          userWalletTransactions: parsedUserActions.userWalletTransactions,
          userAccountHistory: parsedUserActions.userAccountHistory,
          hasMoreGuestActions: get(userActions, ['hasMore'], false),
          withdrawals: userActions.withdrawals,
          deposits: userActions.deposits,
        };
      }),
    },
  });
};

export const getUserEstAccountValue = user => dispatch =>
  dispatch({
    type: GET_USER_EST_ACCOUNT_VALUE.ACTION,
    payload: {
      promise: formatter.estimateAccountValue(user).then(value => ({
        username: user.name,
        value,
      })),
    },
  });

export const updateAccountHistoryFilter = createAction(UPDATE_ACCOUNT_HISTORY_FILTER);

export const setInitialCurrentDisplayedActions = createAction(
  SET_INITIAL_CURRENT_DISPLAYED_ACTIONS,
);

export const addMoreActionsToCurrentDisplayedActions = createAction(
  ADD_MORE_ACTIONS_TO_CURRENT_DISPLAYED_ACTIONS,
);

export const loadingMoreUsersAccountHistory = createAction(LOADING_MORE_USERS_ACCOUNT_HISTORY);

export const loadMoreCurrentUsersActions = username => (dispatch, getState) => {
  dispatch(loadingMoreUsersAccountHistory());
  const { wallet } = getState();
  const { usersAccountHistory, currentDisplayedActions, accountHistoryFilter } = wallet;
  const currentUsersActions = get(usersAccountHistory, username, []);
  const lastDisplayedAction = last(currentDisplayedActions);

  if (isEmpty(lastDisplayedAction)) {
    dispatch(setInitialCurrentDisplayedActions(username));

    return;
  }

  const lastDisplayedActionCount = lastDisplayedAction.actionCount;
  const lastDisplayedActionIndex = findIndex(
    currentUsersActions,
    userAction => userAction.actionCount === lastDisplayedActionCount,
  );
  const moreActions = currentUsersActions.slice(
    lastDisplayedActionIndex + 1,
    lastDisplayedActionIndex + 1 + ACTIONS_DISPLAY_LIMIT,
  );
  const lastMoreAction = last(moreActions);
  const lastMoreActionCount = isEmpty(lastMoreAction) ? 0 : lastMoreAction.actionCount;

  if (moreActions.length === ACTIONS_DISPLAY_LIMIT || lastMoreActionCount === 0) {
    const filteredMoreActions = filter(moreActions, userAction =>
      actionsFilter(userAction, accountHistoryFilter, username),
    );

    dispatch(
      addMoreActionsToCurrentDisplayedActions({
        moreActions,
        filteredMoreActions,
      }),
    );
  } else {
    const lastActionCount = last(currentUsersActions).actionCount;
    const limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;

    dispatch(getMoreUserAccountHistory(username, lastActionCount, limit));
  }
};

export const getUserAccountHistory = (username, tableView, startDate, endDate) => dispatch => {
  const isGuest = guestUserRegex.test(username);

  return dispatch({
    type: GET_USER_ACCOUNT_HISTORY.ACTION,
    payload: {
      promise: getAccountHistory(username, { isGuest }, tableView, startDate, endDate).then(
        userActions => {
          const parsedUserActions = getParsedUserActions(userActions, isGuest);

          return {
            username,
            userWalletTransactions: parsedUserActions.userWalletTransactions,
            userAccountHistory: parsedUserActions.userAccountHistory,
            balance: get(userActions, ['payable'], null),
            hasMoreGuestActions: get(userActions, ['hasMore'], false),
            withdrawals: userActions.withdrawals,
            deposits: userActions.deposits,
          };
        },
      ),
    },
  });
};

export const getUserTransactionHistory = (username, limit, operationNum) => dispatch =>
  dispatch({
    type: GET_TRANSACTIONS_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getTransferHistory(username, limit, operationNum)
        .then(data => ({
          username,
          transactionsHistory: data.wallet,
          operationNum: data.operationNum,
          hasMore: data.hasMore,
        }))
        .catch(error => error),
    },
  });

export const getUserTableTransactionHistory = (
  userName,
  limit,
  tableView,
  types,
  startDate,
  endDate,
  filterAccounts,
  operationNum,
) => dispatch =>
  dispatch({
    type: GET_TABLE_TRANSACTIONS_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getTransferHistoryTableView(
        {
          userName,
          limit,
          tableView,
          startDate,
          endDate,
          operationNum,
        },
        types,
        filterAccounts,
      )
        .then(data => ({
          userName,
          tableTransactionsHistory: data.wallet,
          operationNumTable: data.operationNum,
          withdrawals: data.withdrawals,
          deposits: data.deposits,
          hasMoreTable: data.hasMore,
        }))
        .catch(error => console.error(error)),
    },
  });

export const GET_ERROR_LOADING_TRANSACTIONS = '@wallet/GET_ERROR_LOADING_TRANSACTIONS';

export const getMoreUserTransactionHistory = (username, limit, operationNum) => dispatch =>
  dispatch({
    type: GET_MORE_TRANSACTIONS_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getTransferHistory(username, limit, operationNum)
        .then(data => ({
          username,
          transactionsHistory: data.wallet,
          operationNum: data.operationNum,
          hasMore: data.hasMore,
        }))
        .catch(() =>
          dispatch({
            type: GET_ERROR_LOADING_TRANSACTIONS,
          }),
        ),
    },
  });

export const GET_ERROR_LOADING_TABLE_TRANSACTIONS = '@wallet/GET_ERROR_LOADING_TRANSACTIONS';

export const getMoreTableUserTransactionHistory = ({
  username,
  limit,
  tableView,
  startDate,
  endDate,
  types,
  operationNum,
  filterAccounts,
}) => dispatch =>
  dispatch({
    type: GET_MORE_TABLE_TRANSACTIONS_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getTransferHistoryTableView(
        {
          userName: username,
          limit,
          tableView,
          startDate,
          endDate,
          operationNum,
        },
        types,
        filterAccounts,
      )
        .then(data => ({
          userName: username,
          tableTransactionsHistory: data.wallet,
          operationNumTable: data.operationNum,
          hasMoreTable: data.hasMore,
          withdrawals: data.withdrawals,
          deposits: data.deposits,
        }))
        .catch(() =>
          dispatch({
            type: GET_ERROR_LOADING_TABLE_TRANSACTIONS,
          }),
        ),
    },
  });

export const CLEAR_TRANSACTIONS_HISTORY = '@wallet/CLEAR_TRANSACTIONS_HISTORY';

export const clearTransactionsHistory = () => dispatch =>
  dispatch({
    type: CLEAR_TRANSACTIONS_HISTORY,
  });

export const CLEAR_TABLE_TRANSACTIONS_HISTORY = '@wallet/CLEAR_TABLE_TRANSACTIONS_HISTORY';

export const clearTransactionsTableHistory = () => dispatch =>
  dispatch({
    type: CLEAR_TABLE_TRANSACTIONS_HISTORY,
  });

export const OPEN_WALLET_TABLE = '@wallet/OPEN_WALLET_TABLE';

export const openWalletTable = () => dispatch =>
  dispatch({
    type: OPEN_WALLET_TABLE,
  });

export const CLOSE_WALLET_TABLE = '@wallet/CLOSE_WALLET_TABLE';

export const closeWalletTable = () => dispatch =>
  dispatch({
    type: CLOSE_WALLET_TABLE,
  });

export const OPEN_WITHDRAW = '@wallet/OPEN_WITHDRAW';
export const CLOSE_WITHDRAW = '@wallet/CLOSE_WITHDRAW';

export const openWithdraw = currency => ({
  type: OPEN_WITHDRAW,
  payload: typeof currency === 'string' ? currency?.toLowerCase() : 'eth',
});

export const closeWithdraw = () => ({
  type: CLOSE_WITHDRAW,
});

export const sendPendingTransfer = ({
  sponsor,
  userName,
  amount,
  transactionId,
  memo,
}) => dispatch =>
  dispatch({
    type: SET_PENDING_TRANSFER,
    payload: ApiClient.sendPendingTransfer({ sponsor, userName, amount, transactionId, memo }),
  });

export const GET_TOKEN_RATES = createAsyncActionType('@wallet/GET_TOKEN_RATES');
export const ADAPT_MARKET_TO_ENGINE = '@wallet/ADAPT_MARKET_TO_ENGINE';

export const getTokenRates = tokenName => dispatch =>
  dispatch({
    type: GET_TOKEN_RATES.ACTION,
    payload: ApiClient.getTokensEngineRates(tokenName),
    meta: tokenName,
  });

export const GET_WAIV_TRANSFER_LIST = createAsyncActionType('@wallet/GET_WAIV_TRANSFER_LIST');
export const GET_MORE_WAIV_TRANSFER_LIST = createAsyncActionType(
  '@wallet/GET_MORE_WAIV_TRANSFER_LIST',
);

export const getWAIVTransferList = (
  account,
  timestampEnd,
  lastId,
  type = GET_WAIV_TRANSFER_LIST,
) => (dispatch, getState) => {
  const isGuest = guestUserRegex.test(account);

  return dispatch({
    type: type.ACTION,
    payload: isGuest
      ? getGuestWaivTransferHistory(account, 'WAIV')
      : ApiClient.getEngineTransactionHistory({
          symbol: 'WAIV',
          account,
          timestampEnd,
          lastId,
          limit: 10,
          showRewards: getShowRewards(getState()),
        }),
    meta: 10,
    isGuest,
  });
};

export const getMoreWAIVTransferList = (account, offset, lastId) => dispatch =>
  dispatch(getWAIVTransferList(account, offset, lastId, GET_MORE_WAIV_TRANSFER_LIST));

export const GET_HIVE_ENGINE_TRANSFER_LIST = createAsyncActionType(
  '@wallet/GET_HIVE_ENGINE_TRANSFER_LIST',
);
export const GET_MORE_HIVE_ENGINE_TRANSFER_LIST = createAsyncActionType(
  '@wallet/GET_MORE_HIVE_ENGINE_TRANSFER_LIST',
);

export const getHiveEngineTransferList = (
  account,
  timestampEnd,
  lastId,
  type = GET_HIVE_ENGINE_TRANSFER_LIST,
) => dispatch =>
  dispatch({
    type: type.ACTION,
    payload: ApiClient.getEngineTransactionHistory({
      excludeSymbols: ['WAIV'],
      account,
      timestampEnd,
      limit: 10,
      lastId,
    }).then(res => ({
      list: res.history,
      hasMore: res.history.length === 10,
    })),
  });

export const getMoreHiveEngineTransferList = (account, timestampEnd, lastId) => dispatch =>
  dispatch(
    getHiveEngineTransferList(account, timestampEnd, lastId, GET_MORE_HIVE_ENGINE_TRANSFER_LIST),
  );

export const SET_CURRENT_WALLET = '@wallet/SET_CURRENT_WALLET';

export const setWalletType = wallet => ({
  type: SET_CURRENT_WALLET,
  payload: wallet,
});

export const GET_TOKENS_BALANCE = createAsyncActionType('@wallet/GET_TOKENS_BALANCE');

export const getTokenBalance = (token, name) => dispatch => {
  const isGuest = guestUserRegex.test(name);

  return dispatch({
    type: GET_TOKENS_BALANCE.ACTION,
    payload: isGuest ? getGuestWaivBalance(name, token) : ApiClient.getTokenBalance(name, token),
    meta: { token, isGuest },
  });
};

export const GET_AUTH_USER_TOKENS_BALANCE_LIST = createAsyncActionType(
  '@wallet/GET_AUTH_USER_TOKENS_BALANCE_LIST',
);

export const getUserTokensBalanceList = (
  name,
  type = GET_AUTH_USER_TOKENS_BALANCE_LIST,
  symbol,
) => dispatch =>
  dispatch({
    type: type.ACTION,
    payload: ApiClient.getTokenBalance(name, symbol).then(async res => {
      const tokensList = res.map(item => item.symbol);
      const rates = await ApiClient.getTokensRate(isEmpty(tokensList) ? [symbol] : tokensList);
      const infos = await ApiClient.getTokensInformation(tokensList);

      if (!isEmpty(rates)) {
        const listTokensWithRates = res.map(token => {
          const rate = rates.find(r => r.symbol === token.symbol);
          const info = infos.find(r => r.symbol === token.symbol);

          return {
            ...token,
            stakingEnabled: get(info, 'stakingEnabled', true),
            name: info.name,
            precision: info.precision,
            avatar: get(parseJSON(info.metadata), 'icon', ''),
            rate: +get(rate, 'lastDayPrice', 1),
          };
        });

        return listTokensWithRates.sort((a, b) => {
          if (a.symbol === 'WAIV') return -1;
          if (b.symbol === 'WAIV') return 1;
          if (!b.balance || !a.balance) return a.symbol > b.symbol ? 1 : -1;

          return b.balance - a.balance;
        });
      }

      return res;
    }),
  });

export const GET_CURRENT_USER_TOKENS_BALANCE_LIST = createAsyncActionType(
  '@wallet/GET_CURRENT_USER_TOKENS_BALANCE_LIST',
);

export const getCurrUserTokensBalanceList = name =>
  getUserTokensBalanceList(name, GET_CURRENT_USER_TOKENS_BALANCE_LIST, {
    $nin: ['WAIV', 'SWAP.HIVE', 'SWAP.LTC', 'SWAP.BTC', 'SWAP.ETH'],
  });

export const GET_CURRENT_USER_SWAP_TOKENS_BALANCE_LIST = createAsyncActionType(
  '@wallet/GET_CURRENT_USER_SWAP_TOKENS_BALANCE_LIST',
);

export const getCurrUserTokensBalanceSwap = name => ({
  type: GET_CURRENT_USER_SWAP_TOKENS_BALANCE_LIST.ACTION,
  payload: ApiClient.getTokensInformation(HIVE_ENGINE_DEFAULT_SWAP_LIST).then(async res => {
    const rates = await ApiClient.getEnginePoolRate(HIVE_ENGINE_DEFAULT_SWAP_LIST);
    const userBalances = await ApiClient.getTokenBalance(name, {
      $in: HIVE_ENGINE_DEFAULT_SWAP_LIST,
    });
    const swapList = res.map(swap => {
      const rate = rates.find(r => r.symbol === swap.symbol);
      const userBalance = userBalances.find(r => r.symbol === swap.symbol);

      return {
        ...swap,
        rate: +get(rate, 'USD', 1),
        avatar: get(parseJSON(swap.metadata), 'icon', ''),
        balance: get(userBalance, 'balance', 0),
        orderKey: HIVE_ENGINE_DEFAULT_SWAP_LIST_ORDER_KEY[swap.symbol],
      };
    });

    return swapList.sort((a, b) => a.orderKey - b.orderKey);
  }),
});

export const RESET_TOKENS_BALANCE = '@wallet/RESET_TOKENS_BALANCE';

export const resetTokenBalance = () => ({
  type: RESET_TOKENS_BALANCE,
});

export const RESET_HIVE_ENGINE_TOKENS_BALANCE = '@wallet/RESET_HIVE_ENGINE_TOKENS_BALANCE';

export const resetHiveEngineTokenBalance = () => ({
  type: RESET_HIVE_ENGINE_TOKENS_BALANCE,
});

export const CLAIM_REWARDS = '@wallet/CLAIM_REWARDS';

export const claimRewards = () => ({
  type: CLAIM_REWARDS,
});

export const TOGGLE_DEPOSIT_MODAL = '@wallet/TOGGLE_DEPOSIT_MODAL';

export const toggleDepositModal = () => ({
  type: TOGGLE_DEPOSIT_MODAL,
});

export const TOGGLE_DELEGATE_MODAL = '@wallet/TOGGLE_DELEGATE_MODAL';

export const toggleDelegateModal = (modalType = delegationModalTypes.MANAGE, token = null) => ({
  type: TOGGLE_DELEGATE_MODAL,
  payload: {
    modalType,
    token,
  },
});

export const SET_SHOW_REWARDS = '@wallet/SET_SHOW_REWARDS';

export const setShowRewards = check => ({
  type: SET_SHOW_REWARDS,
  payload: check,
});

export const GET_HIVE_ENGINE_STATUS = '@wallet/GET_HIVE_ENGINE_STATUS';

export const getHiveEngineStatus = () => (dispatch, getState, { busyAPI }) => {
  busyAPI.instance.subscribe((res, mess) => {
    if (mess.type === 'hiveEngineDelay' && mess.notification.delay) {
      dispatch({
        type: GET_HIVE_ENGINE_STATUS,
        payload: mess.notification,
      });
    }
  });
};
