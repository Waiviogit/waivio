import { union } from 'lodash';
import {
  GET_OBJECT_LIST,
  UNFOLLOW_OBLECT_IN_LIST,
  FOLLOW_OBLECT_IN_LIST,
  GET_USERS_LIST,
  UNFOLLOW_USER_IN_LIST,
  FOLLOW_USER_IN_LIST,
  GET_USERS_LIST_MORE,
  GET_OBJECT_MORE_LIST,
  UPDATE_USERS_LIST,
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
    case UNFOLLOW_USER_IN_LIST.START:
    case UNFOLLOW_USER_IN_LIST.SUCCESS:
    case FOLLOW_USER_IN_LIST.START:
    case FOLLOW_USER_IN_LIST.SUCCESS:
      return {
        ...state,
        [action.meta]: {
          ...state[action.meta],
          list: [...action.payload],
        },
      };

    case GET_OBJECT_LIST.SUCCESS:
      return {
        ...state,
        [action.meta]: { list: action.payload.wobjects, hasMore: action.payload.hasMore },
        loading: false,
      };
    case GET_OBJECT_MORE_LIST.SUCCESS:
      return {
        ...state,
        [action.meta]: {
          list: union(state[action.meta].list, action.payload.wobjects),
          hasMore: action.payload.hasMore,
        },
        loading: false,
      };

    case GET_USERS_LIST.START:
      return {
        ...state,
        loading: true,
      };

    case GET_USERS_LIST.SUCCESS:
      return {
        ...state,
        [action.meta]: {
          list: [...action.payload.users],
          hasMore: action.payload.hasMore,
          sort: action.sorting,
          nextCursor: action.payload.nextCursor,
        },
        loading: false,
      };
    case UPDATE_USERS_LIST:
      return {
        ...state,
        [action.meta]: {
          list: state[action.meta].list.filter(u => u.name !== action.payload),
        },
        loading: false,
      };

    case GET_USERS_LIST_MORE.SUCCESS:
      return {
        ...state,
        [action.meta]: {
          list: union(state[action.meta].list, action.payload.users),
          hasMore: action.payload.hasMore,
          nextCursor: action.payload.nextCursor,
          sort: action.sorting,
        },
        loading: false,
      };
    case '@dynamicList/RESET_LISTS':
      return initialState;

    default:
      return state;
  }
};

export default dynamicListReducer;
