import { get } from 'lodash';
import * as types from './authActions';
import {
  GET_USER_METADATA,
  GET_USER_PRIVATE_EMAIL,
  UPDATE_USER_METADATA,
} from '../usersStore/usersActions';

const initialState = {
  isAuthenticated: false,
  isFetching: true,
  showSettings: false,
  isReloading: false,
  loaded: false,
  user: {},
  userMetaData: {},
  privateEmail: '',
  isGuestUser: false,
  tabType: 'global',
  sort: 'recency',
  signature: '',
  guestAuthority: {
    account: '',
    importAuthorization: null,
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOGIN_START:
      if (action.meta && action.meta.refresh) return state;

      return {
        ...state,
        isFetching: true,
        isAuthenticated: false,
        loaded: false,
        // user: {},
        showSettings: false,
        isAuthenticating: true,
      };

    case types.LOGIN_SUCCESS:
      if (state.isAuthenticatedInServer)
        return {
          ...state,
          isFetching: false,
          isAuthenticated: true,
          loaded: true,
          user: {
            ...(action.payload.account || state.user),
            ...(action.payload.isGuestUser ? { waivBalance: action.payload.waivBalance } : {}),
          },
          isAuthenticating: false,
        };

      if (action.meta && action.meta.refresh) return state;

      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        loaded: true,
        user: {
          ...(action.payload.account || state.user),
          ...(action.payload.isGuestUser ? { waivBalance: action.payload.waivBalance } : {}),
        },
        userMetaData: action.payload.userMetaData,
        privateEmail: action.payload.privateEmail,
        isGuestUser: action.payload.isGuestUser,
        tabType: action.payload.tabType,
        isAuthenticating: false,
        signature:
          action.payload.userMetaData?.profile?.signature ||
          (action.payload.account?.posting_json_metadata
            ? JSON.parse(action.payload.account.posting_json_metadata)?.profile?.signature
            : '') ||
          state.signature,
      };
    case types.LOGIN_SERVER.SUCCESS:
      if (action.meta && action.meta.refresh) return state;

      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        isAuthenticatedInServer: true,
        loaded: true,
        user: {
          ...(action.payload.account || state.user),
          ...(action.payload.isGuestUser ? { waivBalance: action.payload.waivBalance } : {}),
        },
        userMetaData: action.payload.userMetaData,
        privateEmail: action.payload.privateEmail,
        isGuestUser: action.payload.isGuestUser,
        tabType: action.payload.tabType,
        signature:
          action.payload.userMetaData?.profile?.signature ||
          (action.payload.account?.posting_json_metadata
            ? JSON.parse(action.payload.account.posting_json_metadata)?.profile?.signature
            : '') ||
          state.signature,
        isAuthenticating: false,
      };

    // eslint-disable-next-line no-lone-blocks
    case types.SET_TAB_REWARDS.SUCCESS: {
      return {
        ...state,
        tabType: action.payload.tabType,
      };
    }

    case types.LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        loaded: false,
        showSettings: false,
        isAuthenticating: false,
      };

    case types.SHOW_SETTINGS:
      return {
        ...state,
        showSettings: true,
      };

    case types.RELOAD_START:
      return {
        ...state,
        isReloading: true,
      };

    case types.RELOAD_SUCCESS:
      return {
        ...state,
        isReloading: false,
        user: {
          ...state.user,
          ...action.payload.account,
        },
      };
    case types.UPDATE_AUTHORITY:
      return {
        ...state,
        isReloading: false,
        user: {
          ...state.user,
          posting: {
            ...state.user.posting,
            account_auths: action.payload,
          },
        },
      };
    case types.UPDATE_GUEST_AUTHORITY:
      return {
        ...state,
        guestAuthority: action.payload,
      };

    case types.RELOAD_ERROR:
      return {
        ...state,
        isReloading: false,
      };

    case types.UPDATE_GUEST_BALANCE.SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          balance: get(action.payload, ['payable'], null),
        },
      };

    case types.LOGOUT:
      return { ...initialState, isFetching: false };

    case GET_USER_METADATA.SUCCESS:
      return {
        ...state,
        userMetaData: action.payload,
      };

    case GET_USER_PRIVATE_EMAIL.SUCCESS:
      return {
        ...state,
        privateEmail: action.payload,
      };

    case types.UPDATE_PROFILE_START:
      return {
        ...state,
        isFetching: true,
      };

    case types.UPDATE_PROFILE_SUCCESS: {
      if (action.payload.isProfileUpdated) {
        return {
          ...state,
          isFetching: false,
          user: {
            ...state.user,
            posting_json_metadata: action.meta,
          },
        };
      }

      return state;
    }

    case UPDATE_USER_METADATA: {
      return {
        ...state,
        userMetaData: {
          ...state.userMetaData,
          ...action.payload,
        },
      };
    }

    case types.CHANGE_SORTING_FOLLOW: {
      return {
        ...state,
        sort: action.payload,
      };
    }
    case types.SET_SIGNATURE: {
      return {
        ...state,
        signature: action.payload,
      };
    }

    // case CLAIM_REWARDS: {
    //   return {
    //     ...state,
    //     user: {
    //       ...state.user,
    //       balance: `${parseFloat(state.user.balance) +
    //         parseFloat(state.user.reward_hive_balance)} HIVE`,
    //       hbd_balance: `${parseFloat(state.user.hbd_balance) +
    //         parseFloat(state.user.reward_hbd_balance)} HBD`,
    //       vesting_shares: `${parseFloat(state.user.vesting_shares) +
    //         parseFloat(state.user.reward_vesting_balance)} VESTS`,
    //     },
    //   };
    // }

    case types.UPDATE_PROFILE_ERROR:
      return state;

    default:
      return state;
  }
};
