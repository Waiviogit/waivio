import { keyBy } from 'lodash';
import { GET_OBJECT_TYPES } from './objectTypesActions';

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
        list: { ...state.list, ...keyBy(action.payload, 'name') },
      };
    default:
      return state;
  }
};

export default feed;
