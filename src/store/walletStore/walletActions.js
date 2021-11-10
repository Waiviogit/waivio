import { each, get, last, findIndex, isEmpty, filter } from 'lodash';
import { createAction } from 'redux-actions';
import formatter from '../../client/helpers/steemitFormatter';
import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import {
  getAccountHistory,
  getDynamicGlobalProperties,
  isWalletTransaction,
  defaultAccountLimit,
} from '../../client/helpers/apiHelpers';
import { ACTIONS_DISPLAY_LIMIT, actionsFilter } from '../../client/helpers/accountHistoryHelper';
import { BXY_GUEST_PREFIX, GUEST_PREFIX } from '../../common/constants/waivio';
import { guestUserRegex } from '../../client/helpers/regexHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

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
  currency = 'HIVE',
  memo = '',
  app,
  tip = false,
  isVipTicket = false,
) => dispatch =>
  dispatch({
    type: OPEN_TRANSFER,
    payload: {
      userName,
      amount,
      currency,
      memo,
      app,
      tip,
      isVipTicket,
    },
  });

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

export const openWithdraw = () => dispatch =>
  dispatch({
    type: OPEN_WITHDRAW,
  });

export const closeWithdraw = () => dispatch =>
  dispatch({
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

export const getWAIVTransferList = (account, offset, type = GET_WAIV_TRANSFER_LIST) => dispatch =>
  dispatch({
    type: type.ACTION,
    payload: ApiClient.getTokensTransferList('WAIV', account, offset),
    meta: 50,
  });

export const getMoreWAIVTransferList = (account, offset) => dispatch =>
  dispatch(getWAIVTransferList(account, offset, GET_MORE_WAIV_TRANSFER_LIST));
