import moment from 'moment';
import { getWaivAdvancedReports } from '../../waivioApi/ApiClient';
import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { guestUserRegex } from '../../common/helpers/regexHelpers';
import { getTransfersAccounts } from './advancedSelectors';
import { getAuthenticatedUserName, isGuestUser } from '../authStore/authSelectors';

const parseTransactionData = trans => {
  if (guestUserRegex.test(trans.userName)) {
    const guestActionType = {
      DEMO_POST: 'demo_post',
      GUEST_TRANSFER: 'user_to_guest_transfer',
      DEMO_DEBT: 'demo_debt',
    };
    const transferDirection = Object.values(guestActionType).includes(trans.type)
      ? { from: trans.sponsor, to: trans.userName }
      : { from: trans.userName, to: trans.sponsor };

    return {
      ...trans,
      ...transferDirection,
      type: 'transfer',
      timestamp: trans.createdAt.split('.')[0],
      amount: `${trans.amount} HIVE`,
      typeTransfer: trans.type,
    };
  }

  return trans;
};

export const GET_TRANSACTIONS_FOR_TABLE = createAsyncActionType(
  '@advanced/GET_TRANSACTIONS_FOR_TABLE',
);

export const getUserTableTransactions = ({
  filterAccounts,
  startDate,
  endDate,
  currency,
  type,
}) => (dispatch, getState) => {
  const state = getState();
  const user = getAuthenticatedUserName(state);
  const isHive = type === 'HIVE';
  const accounts = isHive
    ? filterAccounts?.map(acc => {
        const guest = guestUserRegex.test(acc);

        return {
          name: acc,
          guest,
          ...(guest ? { skip: 0 } : { operationNum: -1 }),
        };
      })
    : filterAccounts.map(acc => ({ name: acc }));

  const body = {
    startDate:
      startDate ||
      moment()
        .subtract(10, 'year')
        .unix(),
    endDate: endDate || moment().unix(),
    filterAccounts,
    accounts,
    currency,
  };

  const method = type === 'HIVE' ? ApiClient.getAdvancedReports : getWaivAdvancedReports;

  return dispatch({
    type: GET_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: method(body, user).then(data => {
        const getCurrentValues = value => (startDate && endDate ? value : 0);

        return {
          data: {
            ...data,
            wallet: data.wallet && data.wallet?.map(parseTransactionData),
            withdrawals: getCurrentValues(data.withdrawals),
            deposits: getCurrentValues(data.deposits),
          },
        };
      }),
    },
  });
};

export const GET_MORE_TRANSACTIONS_FOR_TABLE = createAsyncActionType(
  '@advanced/GET_MORE_TRANSACTIONS_FOR_TABLE',
);

export const getMoreTableUserTransactionHistory = ({
  filterAccounts,
  startDate,
  endDate,
  currency,
  type,
}) => (dispatch, getState) => {
  const state = getState();
  const user = getAuthenticatedUserName(state);
  const accounts = getTransfersAccounts(state);
  const getCurrentValues = value => (startDate && endDate ? value : 0);
  const method = type === 'HIVE' ? ApiClient.getAdvancedReports : getWaivAdvancedReports;

  return dispatch({
    type: GET_MORE_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: method(
        {
          startDate,
          endDate,
          filterAccounts,
          accounts,
          currency,
        },
        user,
      ).then(data => ({
        data: {
          ...data,
          wallet: data.wallet && data.wallet?.map(parseTransactionData),
          withdrawals: getCurrentValues(data.withdrawals),
          deposits: getCurrentValues(data.deposits),
        },
      })),
    },
  });
};

export const GET_USERS_CREATION_DATE = createAsyncActionType('@advanced/GET_USERS_CREATION_DATE');

export const getUsersTransactionDate = name => ({
  type: GET_USERS_CREATION_DATE.ACTION,
  payload: {
    promise: ApiClient.accountsCreationDate(name).then(res => ({ [name]: res.timestamp })),
  },
});

export const DELETE_USERS_CREATION_DATE = '@advanced/DELETE_USERS_CREATION_DATE';

export const deleteUsersTransactionDate = name => ({
  type: DELETE_USERS_CREATION_DATE,
  payload: name,
});

export const CALCULATE_TOTAL_CHANGES = '@advanced/CALCULATE_TOTAL_CHANGES';

export const calculateTotalChanges = (item, checked, currency, typeTable) => dispatch => {
  dispatch({
    type: CALCULATE_TOTAL_CHANGES,
    payload: { amount: item[currency], type: item.withdrawDeposit, decrement: checked },
  });
  dispatch(
    excludeTransfer({
      ...item,
      checked,
      typeTable
    }),
  );
};

export const RESET_REPORTS = '@advanced/RESET_REPORTS';

export const resetReportsData = () => ({
  type: RESET_REPORTS,
});

export const EXCLUDE_TRANSFER = createAsyncActionType('@advanced/EXCLUDE_TRANSFER');

export const excludeTransfer = (body, typeTable) => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);
  const authUserName = getAuthenticatedUserName(state);
  const getKey = guestKey => (guestUserRegex.test(body.userName) ? guestKey : 'operationNum');

  return dispatch({
    type: EXCLUDE_TRANSFER.ACTION,
    payload: ApiClient.excludeAdvancedReports(
      typeTable === 'HIVE' ? {
        userName: authUserName,
        userWithExemptions: body.userName,
        checked: body.checked,
        [getKey('recordId')]: body._id,
      } : {
        userName: authUserName,
        recordId: body._id,
        userWithExemptions: body.account,
        checked: body.checked,
        symbol: 'WAIV',
      },
      isGuest,
    ),
    meta: {
      id: body._id,
      key: getKey('_id'),
    },
  });
};
