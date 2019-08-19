import * as wobjTypeActions from './objectTypeActions';
import { getClientWObj } from '../adapters';

const initialState = {
  data: {},
  filteredObjects: [],
  activeFilters: {},
  fetching: false,
  hasMoreRelatedObjects: true,
};
const objectType = (state = initialState, action) => {
  switch (action.type) {
    case wobjTypeActions.GET_OBJECT_TYPE.START:
      return {
        ...state,
        fetching: true,
      };
    case wobjTypeActions.GET_OBJECT_TYPE.SUCCESS: {
      const { related_wobjects: relatedWobjects, ...data } = action.payload;
      return {
        ...state,
        data,
        filteredObjects: [
          ...state.filteredObjects,
          ...relatedWobjects.map(wObj => getClientWObj(wObj)),
        ],
        hasMoreRelatedObjects: relatedWobjects.length === action.meta.limit,
        fetching: false,
      };
    }
    case wobjTypeActions.CLEAR_OBJECT_TYPE:
      return initialState;
    case wobjTypeActions.GET_OBJECT_TYPE.ERROR:
    default:
      return state;
  }
};

export default objectType;

export const getObjectType = state => state.data;
export const getObjectTypeLoading = state => state.fetching;
export const getFilteredObjects = state => state.filteredObjects;
export const getHasMoreRelatedObjects = state => state.hasMoreRelatedObjects;
