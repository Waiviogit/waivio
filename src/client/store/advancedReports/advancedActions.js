import * as ApiClient from '../../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../helpers/stateHelpers';
import { guestUserRegex } from '../../helpers/regexHelpers';
import { getTransfersAccounts } from './advancedSelectors';

const parseTransactionData = trans => {
  if (guestUserRegex.test(trans.userName)) {
    const guestActionType = {
      DEMO_POST: 'demo_post',
      GUEST_TRANSFER: 'user_to_guest_transfer',
      DEMO_DEBT: 'demo_debt',
    };
    const transferDirection = Object.values(guestActionType).includes(trans.type)
      ? { from: trans.sponsor, to: trans.userName }
      : { from: trans.userName, to: trans.sponsor || 'mock' };

    return {
      ...transferDirection,
      type: 'transfer',
      timestamp: trans.createdAt.split('.')[0],
      amount: `${trans.amount} HIVE`,
      memo: trans.memo || '',
      typeTransfer: trans.type,
      details: trans.details || null,
      userName: trans.userName,
      hbdUSD: trans.hbdUSD,
      hiveUSD: trans.hiveUSD,
      withdrawDeposit: trans.withdrawDeposit,
      usd: trans.usd,
    };
  }

  return trans;
};

export const GET_TRANSACTIONS_FOR_TABLE = createAsyncActionType(
  '@advanced/GET_TRANSACTIONS_FOR_TABLE',
);

export const getUserTableTransactions = (filterAccounts, startDate, endDate) => dispatch => {
  const accounts = filterAccounts.map(acc => {
    const guest = guestUserRegex.test(acc);

    return {
      name: acc,
      guest,
      ...(guest ? { skip: 0 } : { operationNum: -1 }),
    };
  });

  return dispatch({
    type: GET_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: ApiClient.getAdvancedReports({
        startDate,
        endDate,
        filterAccounts,
        accounts,
      }).then(data => {
        const getCurrentValues = value => (startDate && endDate ? value : 0);

        return {
          data: {
            ...data,
            wallet: data.wallet && data.wallet.map(parseTransactionData),
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
export const getMoreTableUserTransactionHistory = ({ filterAccounts, startDate, endDate }) => (
  dispatch,
  getState,
) => {
  const accounts = getTransfersAccounts(getState());
  const getCurrentValues = value => (startDate && endDate ? value : 0);

  return dispatch({
    type: GET_MORE_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: ApiClient.getAdvancedReports({
        startDate,
        endDate,
        filterAccounts,
        accounts,
      }).then(data => ({
        data: {
          ...data,
          wallet: data.wallet && data.wallet.map(parseTransactionData),
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

export const DECREASE_TOTAL = '@advanced/DECREASE_TOTAL';

export const decreaseTotal = (amount, type, decrement) => ({
  type: DECREASE_TOTAL,
  payload: { amount, type, decrement },
});
