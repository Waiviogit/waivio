import { get, isEmpty, omit, reduce, filter, uniq } from 'lodash';
import * as wobjTypeActions from './objectTypeActions';
import { parseWobjectField } from '../../client/helpers/wObjectHelper';

const initialState = {
  data: {},
  filteredObjects: [],
  filtersList: {},
  activeFilters: {},
  activeTagsFilters: {},
  sort: 'weight',
  map: false,
  fetching: false,
  hasMoreRelatedObjects: true,
  mapWobjects: [],
  updated: false,
  tagsForFilter: [],
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
        tagsForFilter,
        ...data
      } = action.payload;
      const filteredRelatedWobjects = relatedWobjects.filter(wObj => {
        const wobjStatus = parseWobjectField(wObj, 'status');

        return (
          !wobjStatus || (wobjStatus.title !== 'unavailable' && wobjStatus.title !== 'relisted')
        );
      });
      const filteredObjects = [...state.filteredObjects, ...filteredRelatedWobjects];
      const filtersList = filters ? omit(filters, ['map']) : {};
      const activeFilters = isEmpty(state.activeFilters)
        ? reduce(filtersList, (result, value, key) => ({ ...result, [key]: [] }), {})
        : { ...state.activeFilters };
      const tagsForFilterList = isEmpty(state.tagsForFilter)
        ? tagsForFilter
        : [...state.tagsForFilter];

      const hasMap = !isEmpty(
        filter(relatedWobjects, object => get(object, ['map']) || get(object, ['parent', 'map'])),
      );

      return {
        ...state,
        data,
        filtersList,
        tagsForFilter: tagsForFilterList,
        activeFilters,
        map: Boolean((filters && !isEmpty(filters.map)) || hasMap),
        filteredObjects,
        hasMoreRelatedObjects: Boolean(hasMoreWobjects),
        fetching: false,
      };
    }
    case wobjTypeActions.GET_OBJECT_TYPE_MAP.SUCCESS: {
      const { filters, ...data } = action.payload;
      const filteredObjects = get(action.payload, 'related_wobjects', []).filter(
        wObj =>
          !wObj.status || (wObj.status.title !== 'unavailable' && wObj.status.title !== 'relisted'),
      );

      return {
        ...state,
        data,
        mapWobjects: filteredObjects,
        map: true,
        updated: true,
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
    case wobjTypeActions.RESET_UPDATED_STATE:
      return {
        ...state,
        updated: false,
      };

    case wobjTypeActions.SHOW_MORE_TAGS_FOR_FILTERS.SUCCESS: {
      const { tags, hasMore } = action.payload;
      const tagsFilter = [...state.tagsForFilter];
      const matchIndex = tagsFilter.findIndex(category => category.tagCategory === action.meta);
      const matchItem = tagsFilter[matchIndex];

      tagsFilter.splice(matchIndex, 1, {
        ...matchItem,
        tags: uniq([...matchItem.tags, ...tags]),
        hasMore,
      });

      return {
        ...state,
        tagsForFilter: [...tagsFilter],
      };
    }

    case wobjTypeActions.SET_ACTIVE_TAGS_FILTERS:
      return {
        ...state,
        activeTagsFilters: action.payload,
        filteredObjects: [],
      };

    default:
      return state;
  }
};

export default objectType;
