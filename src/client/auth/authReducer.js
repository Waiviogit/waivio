import { get } from 'lodash';
import * as types from './authActions';
import {
  GET_USER_METADATA,
  GET_USER_PRIVATE_EMAIL,
  UPDATE_USER_METADATA,
} from '../user/usersActions';

const initialState = {
  isAuthenticated: false,
  isFetching: true,
  isReloading: false,
  loaded: false,
  user: {},
  userMetaData: {},
  privateEmail: '',
  isGuestUser: false,
  sort: 'recency',
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
        user: {},
      };

    case types.LOGIN_SUCCESS:
      if (action.meta && action.meta.refresh) return state;

      return {
        ...state,
        isFetching: false,
        isAuthenticated: true,
        loaded: true,
        user: action.payload.account || state.user,
        userMetaData: action.payload.userMetaData,
        privateEmail: action.payload.privateEmail,
        isGuestUser: action.payload.isGuestUser,
      };

    case types.LOGIN_ERROR:
      return {
        ...state,
        isFetching: false,
        isAuthenticated: false,
        loaded: false,
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

    case types.UPDATE_PROFILE_ERROR:
      return state;

    default:
      return state;
  }
};

export const getIsAuthenticated = state => state.isAuthenticated;
export const getIsAuthFetching = state => state.isFetching;
export const getIsLoaded = state => state.loaded;
export const getIsReloading = state => state.isReloading;
export const getAuthenticatedUser = state => state.user;
export const getAuthenticatedUserName = state => get(state, ['user', 'name'], '');
export const getAuthenticateduserMetaData = state => state.userMetaData;
export const getAuthenticatedUserNotificationsSettings = state =>
  get(state, ['userMetaData', 'settings', 'userNotifications'], {});
export const getAuthenticatedUserPrivateEmail = state => state.privateEmail;
export const getAuthenticatedUserAvatar = state => {
  let jsonMetadata = get(state, 'user.posting_json_metadata');
  if (jsonMetadata) {
    jsonMetadata = JSON.parse(state.user.posting_json_metadata);
    return get(jsonMetadata, 'profile.profile_image');
  }
  return undefined;
};
export const getAuthorizationUserFollowSort = state => state.sort;
export const getHasMap = state => state.map;

export const isGuestUser = state => state.isGuestUser;
