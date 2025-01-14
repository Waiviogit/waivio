import { keyBy } from 'lodash';
import {
  GET_OBJECT_TYPES,
  GET_OBJECT_TYPES_BY_DEPARTMENT,
  GET_MORE_OBJECT_TYPES_BY_DEPARTMENT,
  RESET_OBJECT_TYPES_BY_DEPARTMENT,
} from './objectTypesActions';

const initialState = {
  fetching: false,
  list: {},
  listDepartment: [],
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case GET_OBJECT_TYPES.START:
      return { ...state, fetching: true };

    case GET_OBJECT_TYPES.SUCCESS:
      return {
        ...state,
        fetching: false,
        list: { ...state.list, ...keyBy(action.payload, 'name') },
      };

    case GET_OBJECT_TYPES_BY_DEPARTMENT.START:
      return { ...state, fetching: true, listDepartment: [] };

    case GET_OBJECT_TYPES_BY_DEPARTMENT.SUCCESS:
      return {
        ...state,
        fetching: false,
        listDepartment: action.payload.wobjects,
        hasMore: action.payload.hasMore,
      };

    case GET_MORE_OBJECT_TYPES_BY_DEPARTMENT.SUCCESS:
      return {
        ...state,
        fetching: false,
        listDepartment: [...state.listDepartment, ...action.payload.wobjects],
        hasMore: action.payload.hasMore,
      };

    case RESET_OBJECT_TYPES_BY_DEPARTMENT:
      return {
        ...state,
        listDepartment: [],
        hasMore: false,
      };
    default:
      return state;
  }
};

export default feed;
