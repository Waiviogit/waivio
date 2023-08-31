import { get } from 'lodash';
import * as actions from './usersActions';
import { GET_USER_ACCOUNT_HISTORY } from '../walletStore/walletActions';
import { BELL_USER_NOTIFICATION } from '../userStore/userActions';

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
            ...state.users[action.meta.username],
            fetching: true,
            loaded: false,
            failed: false,
          },
        },
      };
    case actions.GET_ACCOUNT.SUCCESS: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            balance: 0,
            hbd_balance: 0,
            savings_balance: 0,
            savings_hbd_balance: 0,
            vesting_shares: 0,
            ...state.users[action.meta.username],
            ...action.payload,
            fetching: false,
            loaded: true,
            failed: false,
          },
        },
      };
    }
    case actions.GET_INFO_FOR_SIDEBAR.SUCCESS: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            ...action.payload,
            sideBarLoading: false,
          },
        },
      };
    }
    case actions.GET_INFO_FOR_SIDEBAR.START: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            sideBarLoading: true,
          },
        },
      };
    }
    case actions.GET_INFO_FOR_SIDEBAR.ERROR: {
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
            sideBarLoading: false,
          },
        },
      };
    }
    case actions.GET_ACCOUNT.ERROR:
      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...state.users[action.meta.username],
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
          muted: false,
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

      const currentUser = state.users[action.meta.username];

      return {
        ...state,
        users: {
          ...state.users,
          [action.meta.username]: {
            ...currentUser,
            youFollows: true,
            pending: false,
            muted: false,
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
            balance: get(state, ['users', username, 'balance']) || balance,
          },
        },
      };
    }

    case BELL_USER_NOTIFICATION.SUCCESS: {
      return {
        ...state,
        users: {
          [action.payload.following]: {
            ...state.users[action.payload.following],
            bell: action.payload.subscribe,
            bellLoading: false,
          },
        },
      };
    }

    case BELL_USER_NOTIFICATION.START: {
      return {
        ...state,
        users: {
          [action.payload.following]: {
            ...state.users[action.payload.following],
            bellLoading: true,
          },
        },
      };
    }

    case BELL_USER_NOTIFICATION.ERROR: {
      return {
        ...state,
        users: {
          [action.payload.following]: {
            ...state.users[action.payload.following],
            muteLoading: false,
          },
        },
      };
    }

    case actions.MUTE_CURRENT_USER.START: {
      return {
        ...state,
        users: {
          [action.meta.muted]: {
            ...state.users[action.meta.muted],
            muteLoading: true,
          },
        },
      };
    }

    case actions.MUTE_CURRENT_USER.SUCCESS: {
      const user = state.users[action.meta.muted];
      const muted = !user.muted;

      return {
        ...state,
        users: {
          [action.meta.muted]: {
            ...user,
            muted,
            muteLoading: false,
            youFollows: muted ? false : user.youFollows,
          },
        },
      };
    }

    case actions.MUTE_CURRENT_USER.ERROR: {
      return {
        ...state,
        users: {
          [action.meta.muted]: {
            ...state.users[action.meta.muted],
            muteLoading: false,
          },
        },
      };
    }

    default: {
      return state;
    }
  }
}
