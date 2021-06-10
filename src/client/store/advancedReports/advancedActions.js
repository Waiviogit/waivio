import * as ApiClient from '../../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../helpers/stateHelpers';
import { guestUserRegex } from '../../helpers/regexHelpers';
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
      _id: trans._id,
    };
  }

  return trans;
};

export const GET_TRANSACTIONS_FOR_TABLE = createAsyncActionType(
  '@advanced/GET_TRANSACTIONS_FOR_TABLE',
);

export const getUserTableTransactions = (filterAccounts, startDate, endDate) => (
  dispatch,
  getState,
) => {
  const user = getAuthenticatedUserName(getState());
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
      promise: ApiClient.getAdvancedReports(
        {
          startDate,
          endDate,
          filterAccounts,
          accounts,
        },
        user,
      ).then(data => {
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
  const state = getState();
  const user = getAuthenticatedUserName(state);
  const accounts = getTransfersAccounts(state);
  const getCurrentValues = value => (startDate && endDate ? value : 0);

  return dispatch({
    type: GET_MORE_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: ApiClient.getAdvancedReports(
        {
          startDate,
          endDate,
          filterAccounts,
          accounts,
        },
        user,
      ).then(data => ({
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

export const CALCULATE_TOTAL_CHANGES = '@advanced/CALCULATE_TOTAL_CHANGES';

export const calculateTotalChanges = (item, checked) => dispatch => {
  dispatch({
    type: CALCULATE_TOTAL_CHANGES,
    payload: { amount: item.usd, type: item.withdrawDeposit, decrement: checked },
  });
  dispatch(
    excludeTransfer({
      ...item,
      checked,
    }),
  );
};

export const RESET_REPORTS = '@advanced/RESET_REPORTS';

export const resetReportsData = () => ({
  type: RESET_REPORTS,
});

export const EXCLUDE_TRANSFER = createAsyncActionType('@advanced/EXCLUDE_TRANSFER');

export const excludeTransfer = body => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);
  const authUserName = getAuthenticatedUserName(state);
  const key = guestUserRegex.test(body.userName) ? 'recordId' : 'operationNum';

  return dispatch({
    type: EXCLUDE_TRANSFER.ACTION,
    payload: ApiClient.excludeAdvancedReports(
      {
        userName: authUserName,
        userWithExemptions: body.userName,
        checked: body.checked,
        [key]: body.id,
      },
      isGuest,
    ),
    meta: {
      id: body.id,
      key,
    },
  });
};
