import Cookies from 'js-cookie';
import apiExtra from '../../apiExtra/Account';
import { authorizeTokenSuccess } from './userActions';
import { singleton } from '../../platform/singletonPlatform';
import api from '../../configApi/apiResources';
import { createAsyncActionType } from '../../../client/helpers/stateHelpers';

export const AUTHORIZE_TOKEN_SUCCESS = 'AUTHORIZE_TOKEN_SUCCESS';
export const CONNECT_PLATFORM_REQUEST = 'CONNECT_PLATFORM_REQUEST';
export const CONNECT_PLATFORM_SUCCESS = 'CONNECT_PLATFORM_SUCCESS';
export const CONNECT_PLATFORM_ERROR = 'CONNECT_PLATFORM_ERROR';
export const UPDATE_USER_STATISTICS = 'UPDATE_USER_STATISTICS';
export const GET_CHART_DATA = 'GET_CHART_DATA';
export const GET_CHART_DATA_SUCCESS = 'GET_CHART_DATA_SUCCESS';
export const UPDATE_USER_ACCOUNT_CURRENCY = 'UPDATE_USER_ACCOUNT_CURRENCY';
export const UPDATE_USER_ACCOUNTS = 'UPDATE_USER_ACCOUNTS';
export const GET_USER_SETTINGS = 'GET_USER_SETTINGS';
export const GET_CROSS_STATISTICS = 'GET_CROSS_STATISTICS';
export const GET_ACCOUNT_STATISTICS_MAP = 'GET_ACCOUNT_STATISTICS_MAP';
export const GET_CURRENCY_SETTINGS = 'GET_CURRENCY_SETTINGS';
export const UPDATE_USER_WALLET = 'UPDATE_USER_WALLET';
export const CLEAN_STATISTICS_DATA = 'CLEAN_STATISTICS_DATA';

export const GET_CURRENCIES_DESCRIPTIONS = createAsyncActionType('GET_CURRENCIES_DESCRIPTIONS');

const localStorageData = [
  'sid',
  'stompUser',
  'stompPassword',
  'um_session',
  'broker_id',
  'WEBSRV',
  'token',
  'accounts',
  'email',
];
const cookiesData = ['platformName'];

export function connectPlatform() {
  return dispatch => {
    singleton.createWebSocketConnection();
    dispatch(connectPlatformRequest());
  };
}

export function getUserCrossStatistics() {
  return { type: GET_CROSS_STATISTICS };
}

export function getCrossStatistics() {
  return dispatch => {
    singleton._platform.getCrossStatistics();
    dispatch(getUserCrossStatistics());
  };
}

export function authorizeToken(token) {
  return dispatch => {
    apiExtra.logonWithToken(token).then(({ data, error }) => {
      if (error) {
        localStorage.removeItem('accounts');
      } else if (
        !error &&
        data &&
        data.tradingPlatformAccounts &&
        data.tradingPlatformAccounts.length > 0
      ) {
        dispatch(authorizeTokenSuccess(data.tradingPlatformAccounts[0]));
      }
    });
  };
}

export function getUserSettings(data) {
  return { type: GET_USER_SETTINGS, payload: data };
}

export function getCurrencySettings(data) {
  return { type: GET_CURRENCY_SETTINGS, payload: data };
}

export function getAccountStatisticsMap(data) {
  return { type: GET_ACCOUNT_STATISTICS_MAP, payload: data };
}

export function getCurrenciesDescription() {
  return dispatch =>
    dispatch({
      type: GET_CURRENCIES_DESCRIPTIONS.ACTION,
      payload: {
        promise: api.platform.getCryptoCurrenciesDescription(),
      },
    });
}

export function checkAccountId() {
  return dispatch => {
    const accounts = localStorage.getItem('accounts');
    if (accounts) {
      dispatch(
        authorizeTokenSuccess({
          accountId: Object.keys(JSON.stringify(accounts))[0].toUpperCase(),
        }),
      );
    }
  };
}

export function disconnectPlatform() {
  localStorageData.forEach(data => {
    localStorage.removeItem(data);
  });
  cookiesData.forEach(data => {
    Cookies.remove(data);
  });
  singleton.closeWebSocketConnection();
  singleton.platform = 'widgets';
}

export function connectPlatformRequest() {
  return { type: CONNECT_PLATFORM_REQUEST };
}

export function connectPlatformSuccess(platformName) {
  return { type: CONNECT_PLATFORM_SUCCESS, payload: platformName };
}

export function updateUserStatistics(balance) {
  return { type: UPDATE_USER_STATISTICS, payload: balance };
}

export function updateUserWallet() {
  return { type: UPDATE_USER_WALLET };
}

export function updateUserAccountCurrency(currency) {
  return { type: UPDATE_USER_ACCOUNT_CURRENCY, payload: currency };
}

export function updateUserAccounts(accountsData) {
  return { type: UPDATE_USER_ACCOUNTS, payload: accountsData };
}

export function connectPlatformError() {
  return { type: CONNECT_PLATFORM_ERROR };
}

export function cleanUserStatisticsData() {
  return { type: CLEAN_STATISTICS_DATA };
}
