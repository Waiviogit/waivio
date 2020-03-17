import {
  AUTHORIZE_BROKER_REQUEST,
  AUTHORIZE_BROKER_SUCCESS,
  AUTHORIZE_BROKER_ERROR,
  REGISTER_BROKER_REQUEST,
  REGISTER_BROKER_SUCCESS,
  REGISTER_BROKER_ERROR,
  FORGOT_PASS_BROKER_REQUEST,
  FORGOT_PASS_BROKER_SUCCESS,
  FORGOT_PASS_BROKER_ERROR,
} from '../actions/brokersActions';
import {
  CONNECT_PLATFORM_REQUEST,
  CONNECT_PLATFORM_SUCCESS,
  CONNECT_PLATFORM_ERROR,
  UPDATE_USER_ACCOUNT_CURRENCY,
  UPDATE_USER_ACCOUNTS,
  UPDATE_USER_STATISTICS,
  GET_USER_SETTINGS,
  GET_ACCOUNT_STATISTICS_MAP,
} from '../actions/platformActions';
// import { SIGN_OUT_SUCCESS } from '../actions/authenticate/authenticate';

const initialState = {
  initialize: false,
  connect: false,
  platformName: 'widgets',
  userStatistics: {},
  userSettings: {},
  accountsMap: {},
  walletMap: {},
  isLoading: false,
  accountCurrency: 'USD',
  currentAccountName: '',
  accounts: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case CONNECT_PLATFORM_REQUEST:
      return {
        ...state,
        initialize: true,
        connect: false,
        isLoading: true,
        platformName: 'widgets',
      };
    case CONNECT_PLATFORM_SUCCESS:
      return {
        ...state,
        initialize: true,
        connect: true,
        isLoading: false,
        platformName: action.payload,
      };
    case CONNECT_PLATFORM_ERROR:
      return {
        ...state,
        initialize: true,
        connect: false,
        isLoading: false,
        platformName: 'widgets',
      };
    case UPDATE_USER_STATISTICS:
      return { ...state, userStatistics: action.payload };
    case GET_USER_SETTINGS:
      return { ...state, accountsMap: action.payload };
    case GET_ACCOUNT_STATISTICS_MAP:
      return { ...state, walletMap: action.payload };
    case UPDATE_USER_ACCOUNT_CURRENCY:
      return { ...state, accountCurrency: action.payload };
    case UPDATE_USER_ACCOUNTS:
      return {
        ...state,
        currentAccountName: action.payload.currentAccountName,
        accounts: action.payload.accounts,
      };
    case AUTHORIZE_BROKER_REQUEST:
    case FORGOT_PASS_BROKER_REQUEST:
    case REGISTER_BROKER_REQUEST:
      return { ...state, isLoading: true };
    case AUTHORIZE_BROKER_SUCCESS:
    case AUTHORIZE_BROKER_ERROR:
    case REGISTER_BROKER_ERROR:
    case FORGOT_PASS_BROKER_SUCCESS:
    case FORGOT_PASS_BROKER_ERROR:
      return { ...state, isLoading: false };
    // case SIGN_OUT_SUCCESS:
    //     return initialState;
    default:
      return state;
  }
}

export const getPlatformName = state => state.platformName;
export const getAccountsMap = state => state.accountsMap;
