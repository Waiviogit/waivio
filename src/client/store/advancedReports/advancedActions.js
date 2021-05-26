import * as ApiClient from '../../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../helpers/stateHelpers';
import { guestUserRegex } from '../../helpers/regexHelpers';
import { getTransfersAccounts } from './advancedSelectors';

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
      }).then(data => ({
        data,
      })),
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

  return dispatch({
    type: GET_MORE_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: ApiClient.getAdvancedReports({
        startDate,
        endDate,
        filterAccounts,
        accounts,
      }).then(data => ({
        data,
      })),
    },
  });
};
