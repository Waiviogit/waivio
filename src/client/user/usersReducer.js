import { get } from 'lodash';
import * as actions from './usersActions';

const initialState = {
  users: {},
  topExperts: {
    list: [],
    isFetching: false,
    hasMore: true,
  },
  randomExperts: {
    list: [],
    isFetching: false,
    fetched: false,
  },
};

const getUserDetailsKey = username => `user-${username}`;

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ACCOUNT.START:
      return {
        ...state,
        users: {
          ...state.users,
          [getUserDetailsKey(action.meta.username)]: {
            ...state[getUserDetailsKey(action.meta.username)],
            fetching: true,
            loaded: false,
            failed: false,
          },
        },
      };
    case actions.GET_ACCOUNT.SUCCESS:
      return {
        ...state,
        users: {
          ...state.users,
          [getUserDetailsKey(action.meta.username)]: {
            ...state[getUserDetailsKey(action.meta.username)],
            ...action.payload,
            fetching: false,
            loaded: true,
            failed: false,
          },
        },
      };
    case actions.GET_ACCOUNT.ERROR:
      return {
        ...state,
        users: {
          ...state.users,
          [getUserDetailsKey(action.meta.username)]: {
            ...state[getUserDetailsKey(action.meta.username)],
            fetching: false,
            loaded: false,
            failed: true,
          },
        },
      };
    case actions.GET_RANDOM_EXPERTS_START:
      return {
        ...state,
        randomExperts: {
          ...state.randomExperts,
          isFetching: true,
          fetched: false,
        },
      };
    case actions.GET_RANDOM_EXPERTS_SUCCESS:
      return {
        ...state,
        randomExperts: {
          list: action.payload.sort((a, b) => b.weight - a.weight),
          isFetching: false,
          fetched: true,
        },
      };
    case actions.GET_RANDOM_EXPERTS_ERROR:
      return {
        ...state,
        randomExperts: {
          ...state.randomExperts,
          isFetching: false,
          fetched: false,
        },
      };
    case actions.GET_TOP_EXPERTS_START:
      return {
        ...state,
        topExperts: {
          ...state.topExperts,
          isFetching: true,
        },
      };
    case actions.GET_TOP_EXPERTS_SUCCESS:
      return {
        ...state,
        topExperts: {
          list: [...state.topExperts.list, ...action.payload],
          isFetching: false,
          hasMore: action.meta.limit === action.payload.length,
        },
      };
    case actions.GET_TOP_EXPERTS_ERROR:
      return {
        ...state,
        topExperts: {
          ...state.topExperts,
          isFetching: false,
          hasMore: false,
        },
      };
    default: {
      return state;
    }
  }
}

export const getUser = (state, username) => get(state.users, getUserDetailsKey(username), {});
export const getIsUserFetching = (state, username) => getUser(state, username).fetching || false;
export const getIsUserLoaded = (state, username) => getUser(state, username).loaded || false;
export const getIsUserFailed = (state, username) => getUser(state, username).failed || false;
export const getTopExperts = state => state.topExperts.list;
export const getTopExpertsLoading = state => state.topExperts.isFetching;
export const getTopExpertsHasMore = state => state.topExperts.hasMore;
export const getRandomExperts = state => state.randomExperts.list;
export const getRandomExpertsLoaded = state => state.randomExperts.fetched;
export const getRandomExpertsLoading = state => state.randomExperts.isFetching;
