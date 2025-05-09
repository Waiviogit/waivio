import moment from 'moment';
import {
  excludeInReportsDetails,
  generateAdvancedReports,
  getHistoryGenerateAdvancedReports,
  getInProgressGenerateAdvancedReports,
  getWaivAdvancedReports,
  pauseGenerateReport,
  resumeGenerateReport,
  stopGenerateReport,
} from '../../waivioApi/ApiClient';
import * as ApiClient from '../../waivioApi/ApiClient';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import { guestUserRegex } from '../../common/helpers/regexHelpers';
import { getTransactions, getTransfersAccounts } from './advancedSelectors';
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
  addSwaps,
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
    addSwaps: !addSwaps,
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

export const getReportDetails = reportId => dispatch =>
  dispatch({
    type: GET_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: ApiClient.getReportsDetails(reportId, 0, 500).then(data => ({
        data: {
          ...data,
          wallet: data.wallet && data.wallet?.map(parseTransactionData),
          withdrawals: data.withdrawals,
          deposits: data.deposits,
          reportCurrency: data.currency,
          reportAccounts: data.filterAccounts,
        },
      })),
    },
  });

export const GET_MORE_TRANSACTIONS_FOR_TABLE = createAsyncActionType(
  '@advanced/GET_MORE_TRANSACTIONS_FOR_TABLE',
);

export const getMoreTableUserTransactionHistory = ({
  filterAccounts,
  startDate,
  endDate,
  currency,
  addSwaps,
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
          addSwaps: !addSwaps,
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

export const getMoreReportDetails = reportId => (dispatch, getState) => {
  const skip = getTransactions(getState()).length;

  return dispatch({
    type: GET_MORE_TRANSACTIONS_FOR_TABLE.ACTION,
    payload: {
      promise: ApiClient.getReportsDetails(reportId, skip, 500).then(data => ({
        data: {
          ...data,
          wallet: data.wallet && data.wallet?.map(parseTransactionData),
          withdrawals: 0,
          deposits: 0,
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
    excludeTransfer(
      {
        ...item,
        checked,
      },
      typeTable,
    ),
  );
};

export const calculateTotalChangesInDetails = (recordId, item, checked, currency) => (
  dispatch,
  getState,
) => {
  const authUserName = getAuthenticatedUserName(getState());
  const getKey = guestKey => (guestUserRegex.test(item.userName) ? guestKey : 'operationNum');

  dispatch({
    type: CALCULATE_TOTAL_CHANGES,
    payload: { amount: item[currency], type: item.withdrawDeposit, decrement: checked },
  });
  dispatch({
    type: EXCLUDE_TRANSFER.ACTION,
    payload: excludeInReportsDetails(recordId, item._id, authUserName),
    meta: {
      id: item._id,
      key: getKey('_id'),
    },
  });
};

export const RESET_REPORTS = '@advanced/RESET_REPORTS';

export const resetReportsData = () => ({
  type: RESET_REPORTS,
});

export const GENERATE_REPORTS = '@advanced/GENERATE_REPORTS';

export const getReportUpdate = callback => (dispatch, getState, { busyAPI }) => {
  let time = 0;

  busyAPI.instance.subscribe((e, data) => {
    if (
      (data?.notification?.type === 'updateReport' && data.notification?.timestamp - time >= 5) ||
      data?.notification?.type === 'finishReport'
    ) {
      callback();
      time = data.notification?.timestamp;
    }
  });
};

export const generateReports = body => (dispatch, getState) => {
  const authenticatedUserName = getAuthenticatedUserName(getState());

  return generateAdvancedReports(body, authenticatedUserName).then(report => {
    dispatch({
      type: GENERATE_REPORTS,
      report,
    });
  });
};

export const GET_IN_PROGRESS_REPORTS = createAsyncActionType('@advanced/GET_IN_PROGRESS_REPORTS');

export const getInProgressReports = () => (dispatch, getState) => {
  const authenticatedUserName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_IN_PROGRESS_REPORTS.ACTION,
    payload: getInProgressGenerateAdvancedReports(authenticatedUserName),
  });
};

export const STOP_IN_PROGRESS_REPORTS = createAsyncActionType('@advanced/STOP_IN_PROGRESS_REPORTS');

export const stopInProgressReports = id => (dispatch, getState) => {
  const authenticatedUserName = getAuthenticatedUserName(getState());

  return dispatch({
    type: STOP_IN_PROGRESS_REPORTS.ACTION,
    payload: stopGenerateReport(authenticatedUserName, id),
    meta: id,
  });
};

export const RESUME_IN_PROGRESS_REPORTS = createAsyncActionType(
  '@advanced/RESUME_IN_PROGRESS_REPORTS',
);

export const resumeInProgressReports = id => (dispatch, getState) => {
  const authenticatedUserName = getAuthenticatedUserName(getState());

  return dispatch({
    type: RESUME_IN_PROGRESS_REPORTS.ACTION,
    payload: resumeGenerateReport(authenticatedUserName, id),
    meta: id,
  });
};

export const PAUSE_IN_PROGRESS_REPORTS = createAsyncActionType(
  '@advanced/PAUSE_IN_PROGRESS_REPORTS',
);

export const pauseInProgressReports = id => (dispatch, getState) => {
  const authenticatedUserName = getAuthenticatedUserName(getState());

  return dispatch({
    type: PAUSE_IN_PROGRESS_REPORTS.ACTION,
    payload: pauseGenerateReport(authenticatedUserName, id),
    meta: id,
  });
};

export const GET_HISTORY_REPORTS = createAsyncActionType('@advanced/GET_HISTORY_REPORTS');

export const getHistoryReports = () => (dispatch, getState) => {
  const authenticatedUserName = getAuthenticatedUserName(getState());

  return dispatch({
    type: GET_HISTORY_REPORTS.ACTION,
    payload: getHistoryGenerateAdvancedReports(authenticatedUserName),
  });
};

export const EXCLUDE_TRANSFER = createAsyncActionType('@advanced/EXCLUDE_TRANSFER');

export const excludeTransfer = (body, typeTable) => (dispatch, getState) => {
  const state = getState();
  const isGuest = isGuestUser(state);
  const authUserName = getAuthenticatedUserName(state);
  const getKey = guestKey => (guestUserRegex.test(body.userName) ? guestKey : 'operationNum');

  return dispatch({
    type: EXCLUDE_TRANSFER.ACTION,
    payload: ApiClient.excludeAdvancedReports(
      typeTable === 'HIVE'
        ? {
            userName: authUserName,
            userWithExemptions: body.userName,
            checked: body.checked,
            [getKey('recordId')]: body._id,
          }
        : {
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
