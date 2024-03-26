import { union } from 'lodash';
import {
  GET_OBJECT_LIST,
  UNFOLLOW_OBLECT_IN_LIST,
  FOLLOW_OBLECT_IN_LIST,
  GET_USERS_LIST,
  UNFOLLOW_USER_IN_LIST,
  FOLLOW_USER_IN_LIST,
} from './dynamicListActions';

const initialState = {
  loading: false,
};

const dynamicListReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OBJECT_LIST.START:
      return {
        ...state,
        loading: true,
      };

    case UNFOLLOW_OBLECT_IN_LIST.START:
    case UNFOLLOW_OBLECT_IN_LIST.SUCCESS:
    case FOLLOW_OBLECT_IN_LIST.START:
    case FOLLOW_OBLECT_IN_LIST.SUCCESS:
      return {
        ...state,
        [action.meta]: {
          ...state[action.meta],
          wobjects: [...action.payload],
        },
      };

    case GET_OBJECT_LIST.SUCCESS:
      if (state[action.meta]) {
        return {
          ...state,
          [action.meta]: {
            wobjects: union(state[action.meta].wobjects, action.payload.wobjects),
            hasMore: action.payload.hasMore,
          },
          loading: false,
        };
      }

      return {
        ...state,
        [action.meta]: action.payload,
        loading: false,
      };
    case GET_USERS_LIST.START:
      return {
        ...state,
        loading: true,
      };

    case UNFOLLOW_USER_IN_LIST.START:
    case UNFOLLOW_USER_IN_LIST.SUCCESS:
    case FOLLOW_USER_IN_LIST.START:
    case FOLLOW_USER_IN_LIST.SUCCESS:
      return {
        ...state,
        [action.meta]: {
          ...state[action.meta],
          users: [...action.users],
        },
      };

    case GET_USERS_LIST.SUCCESS:
      if (state[action.meta] && action.sorting === state[action.meta].sort) {
        return {
          ...state,
          [action.meta]: {
            users: union(state[action.meta].users, action.payload.users),
            hasMore: action.payload.hasMore,
            sort: action.sorting,
          },
          loading: false,
        };
      }

      return {
        ...state,
        [action.meta]: {
          users: action.payload.users,
          hasMore: action.payload.hasMore,
          sort: action.sorting,
        },
        loading: false,
      };

    default:
      return state;
  }
};

export default dynamicListReducer;
