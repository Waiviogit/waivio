import _ from 'lodash';
import { GET_OBJECT_TYPES, GET_MORE_OBJECTS_BY_TYPE } from './objectTypesActions';

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
    case GET_MORE_OBJECTS_BY_TYPE.SUCCESS: {
      const { type, data } = action.payload;
      const typeObject = state.list[type];
      return {
        ...state,
        list: {
          ...state.list,
          [type]: {
            ...typeObject,
            related_wobjects: [...typeObject.related_wobjects, ...data.related_wobjects],
            hasMoreWobjects: Boolean(data.hasMoreWobjects),
          },
        },
      };
    }
    default:
      return state;
  }
};

export default feed;

export const getObjectTypesList = state => state.list;
export const getObjectTypesLoading = state => state.fetching;
