import { get, isEmpty, omit, reduce } from 'lodash';
import * as wobjTypeActions from './objectTypeActions';
import { getClientWObj } from '../adapters';

const initialState = {
  data: {},
  filteredObjects: [],
  filtersList: {},
  activeFilters: {},
  sort: 'weight',
  map: false,
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
      const { initialLoad, locale } = action.meta;
      const {
        related_wobjects: relatedWobjects,
        hasMoreWobjects,
        filters,
        ...data
      } = action.payload;
      let filteredObjects = [
        ...state.filteredObjects,
        ...relatedWobjects.map(wObj => getClientWObj(wObj, locale)),
      ];
      if (initialLoad) filteredObjects = relatedWobjects.map(wObj => getClientWObj(wObj, locale));
      const filtersList = filters ? omit(filters, ['map']) : {};
      const activeFilters = isEmpty(state.activeFilters)
        ? reduce(
            filtersList,
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
        filtersList,
        activeFilters,
        map: Boolean(filters && !isEmpty(filters.map)),
        filteredObjects,
        hasMoreRelatedObjects: Boolean(hasMoreWobjects),
        fetching: false,
      };
    }
    case wobjTypeActions.UPDATE_ACTIVE_FILTERS:
      return {
        ...state,
        filteredObjects: [],
        activeFilters: action.payload,
      };
    case wobjTypeActions.CHANGE_SORTING:
      return {
        ...state,
        filteredObjects: [],
        sort: action.payload,
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
export const getAvailableFilters = state => state.filtersList;
export const getActiveFilters = state => state.activeFilters;
export const getTypeName = state => get(state, ['data', 'name'], '');
export const getHasMap = state => state.map;
export const getSorting = state => state.sort;
