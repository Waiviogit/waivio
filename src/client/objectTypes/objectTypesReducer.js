import _ from 'lodash';
import { GET_OBJECT_TYPES } from './objectTypesActions';
import { LOGOUT } from "../auth/authActions";

const initialState = {
  fetching: false,
  list: {},
};

const feed = (state = initialState, action) => {
  switch (action.type) {
    case GET_OBJECT_TYPES.START:
      return { ...state, fetching: true };
    case GET_OBJECT_TYPES.SUCCESS:
      return {
        ...state,
        fetching: false,
        list: { ...state.list, ..._.keyBy(action.payload, 'name') },
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default feed;

export const getObjectTypesList = state => state.list;
export const getObjectTypesLoading = state => state.fetching;
