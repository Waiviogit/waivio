import { get } from 'lodash';
import * as actions from './usersActions';
import { GET_USER_ACCOUNT_HISTORY } from '../wallet/walletActions';

const initialState = {
  users: {},
  tabType: '',
  hasReceivables: '',
  countTookPartCampaigns: 0,
  createdCampaignsCount: 0,
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

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ACCOUNT.START:
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state[action.meta.username],
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
          [action.meta.username]: {
            ...state[action.meta.username],
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
          [action.meta.username]: {
            ...state[action.meta.username],
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
    case actions.UNFOLLOW_USER.SUCCESS: {
      if (action.meta.top) {
        const findExperts = state.topExperts.list.findIndex(
          user => user.name === action.meta.username,
        );

        state.topExperts.list.splice(findExperts, 1, {
          ...state.topExperts.list[findExperts],
          youFollows: false,
          pending: false,
        });

        return {
          ...state,
          topExperts: {
            ...state.topExperts,
            list: [...state.topExperts.list],
          },
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            followers_count: state.users[action.meta.username].followers_count - 1,
            youFollows: false,
            pending: false,
          },
        },
      };
    }

    case actions.UNFOLLOW_USER.START:
      if (action.meta.top) {
        const findExperts = state.topExperts.list.findIndex(
          user => user.name === action.meta.username,
        );

        state.topExperts.list.splice(findExperts, 1, {
          ...state.topExperts.list[findExperts],
          pending: true,
        });

        return {
          ...state,
          topExperts: {
            ...state.topExperts,
            list: [...state.topExperts.list],
          },
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            pending: true,
          },
        },
      };

    case actions.UNFOLLOW_USER.ERROR:
      if (action.meta.top) {
        const findExperts = state.topExperts.list.findIndex(
          user => user.name === action.meta.username,
        );

        state.topExperts.list.splice(findExperts, 1, {
          ...state.topExperts.list[findExperts],
          pending: false,
        });

        return {
          ...state,
          topExperts: {
            ...state.topExperts,
            list: [...state.topExperts.list],
          },
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            pending: false,
          },
        },
      };

    case actions.FOLLOW_USER.START: {
      if (action.meta.top) {
        const findExperts = state.topExperts.list.findIndex(
          user => user.name === action.meta.username,
        );

        state.topExperts.list.splice(findExperts, 1, {
          ...state.topExperts.list[findExperts],
          pending: true,
        });

        return {
          ...state,
          topExperts: {
            ...state.topExperts,
            list: [...state.topExperts.list],
          },
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            pending: true,
          },
        },
      };
    }
    case actions.FOLLOW_USER.SUCCESS: {
      if (action.meta.top) {
        const findExperts = state.topExperts.list.findIndex(
          user => user.name === action.meta.username,
        );
        state.topExperts.list.splice(findExperts, 1, {
          ...state.topExperts.list[findExperts],
          youFollows: true,
          pending: false,
        });

        return {
          ...state,
          topExperts: {
            ...state.topExperts,
            list: [...state.topExperts.list],
          },
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            followers_count: state.users[action.meta.username].followers_count + 1,
            youFollows: true,
            pending: false,
          },
        },
      };
    }

    case actions.FOLLOW_USER.ERROR: {
      if (action.meta.top) {
        const findExperts = state.topExperts.list.findIndex(
          user => user.name === action.meta.username,
        );

        state.topExperts.list.splice(findExperts, 1, {
          ...state.topExperts.list[findExperts],
          pending: false,
        });

        return {
          ...state,
          topExperts: {
            ...state.topExperts,
            list: [...state.topExperts.list],
          },
        };
      }

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            pending: false,
          },
        },
      };
    }

    case actions.CHANGE_COUNTER:
      return {
        ...state,
        users: {
          ...state.users,
          [action.payload.username]: {
            ...state.users[action.payload.username],
            [action.payload.key]: action.payload.counter,
          },
        },
      };

    case GET_USER_ACCOUNT_HISTORY.SUCCESS: {
      // we get balance in payload only for guest users
      const { username, balance } = action.payload;
      return {
        ...state,
        users: {
          ...state.users,
          [username]: {
            ...state.users[username],
            balance: get(state, ['users', username, 'balance'], balance),
          },
        },
      };
    }

    default: {
      return state;
    }
  }
}

export const getAllUsers = state => get(state, 'users', {});
export const getUser = (state, username) => get(state, ['users', username], {});
export const getIsUserFetching = (state, username) => getUser(state, username).fetching || false;
export const getIsUserLoaded = (state, username) => getUser(state, username).loaded || false;
export const getIsUserFailed = (state, username) => getUser(state, username).failed || false;
export const getTopExperts = state => state.topExperts.list;
export const getTopExpertsLoading = state => state.topExperts.isFetching;
export const getTopExpertsHasMore = state => state.topExperts.hasMore;
export const getRandomExperts = state => state.randomExperts.list;
export const getRandomExpertsLoaded = state => state.randomExperts.fetched;
export const getRandomExpertsLoading = state => state.randomExperts.isFetching;
