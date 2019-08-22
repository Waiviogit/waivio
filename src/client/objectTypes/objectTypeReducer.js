import { isEmpty, reduce } from 'lodash';
import * as wobjTypeActions from './objectTypeActions';
import { getClientWObj } from '../adapters';

const initialState = {
  data: {},
  filteredObjects: [],
  filters: {
    top_rated: ['presentation', 'taste', 'value'],
    cuisine: ['American', 'Asian', 'BBQ', 'Italian', 'Russian', 'Georgian', 'USA'],
    ingredients: ['Beef', 'Fish', 'Chicken'],
  },
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
      const {
        related_wobjects: relatedWobjects,
        hasMoreWobjects,
        filters,
        ...data
      } = action.payload;
      const allFilt = { ...state.filters, ...filters }; // todo: remove mock in future
      const activeFilters = isEmpty(state.activeFilters)
        ? reduce(
            allFilt,
            (result, value, key) => {
              result[key] = []; // eslint-disable-line
              return result;
            },
            {},
          )
        : { ...state.activeFilters };
      return {
        ...state,
        data,
        filters: allFilt,
        activeFilters,
        filteredObjects: [
          ...state.filteredObjects,
          ...relatedWobjects.map(wObj => getClientWObj(wObj)),
        ],
        hasMoreRelatedObjects: Boolean(hasMoreWobjects),
        fetching: false,
      };
    }
    case wobjTypeActions.UPDATE_ACTIVE_FILTERS:
      return {
        ...state,
        activeFilters: action.payload,
      };
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
export const getAvailableFilters = state => state.filters;
export const getActiveFilters = state => state.activeFilters;
