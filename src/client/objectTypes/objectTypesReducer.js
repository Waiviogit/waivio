import _ from 'lodash';
import { GET_OBJECT_TYPES } from './objectTypesActions';

import listOfObjectTypes from '../../common/constants/listOfObjectTypes';

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
    default:
      return state;
  }
};

export default feed;

export const getObjectTypesList = state => {
  // Commented functional for automatic adding of types in the end of objectTypesListSorted object
  // const objectTypesListNotInOrder = _.filter(state.list, ({name}) => !listOfObjectTypes.includes(name));
  const objectTypesListSorted = {};
  listOfObjectTypes.forEach(type => {
    if (state.list[type]) {
      objectTypesListSorted[type] = state.list[type];
    }
  });
  return objectTypesListSorted;
  // return {...objectTypesListSorted, ...objectTypesListNotInOrder};
};
export const getObjectTypesLoading = state => state.fetching;
