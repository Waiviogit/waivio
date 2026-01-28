import { get, isEmpty, omit, reduce, filter, uniq, uniqBy } from 'lodash';
import * as wobjTypeActions from './objectTypeActions';
import { parseWobjectField } from '../../common/helpers/wObjectHelper';

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
  tagCategories: [],
  categoryTags: {},
  tagCategoriesFetching: false,
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
      const skip = action.meta?.skip || 0;
      const filteredRelatedWobjects = filter(relatedWobjects, wObj => {
        const wobjStatus = parseWobjectField(wObj, 'status');

        return (
          !wobjStatus || (wobjStatus.title !== 'unavailable' && wobjStatus.title !== 'relisted')
        );
      });
      const filteredObjects =
        skip === 0
          ? filteredRelatedWobjects
          : [...state.filteredObjects, ...filteredRelatedWobjects];
      const filtersList = filters ? omit(filters, ['map']) : {};
      const activeFilters = isEmpty(state.activeFilters)
        ? reduce(filtersList, (result, value, key) => ({ ...result, [key]: [] }), {})
        : { ...state.activeFilters };

      const hasMap = !isEmpty(
        filter(relatedWobjects, object => get(object, ['map']) || get(object, ['parent', 'map'])),
      );

      return {
        ...state,
        data,
        filtersList,
        activeFilters,
        map: Boolean((filters && !isEmpty(filters?.map)) || hasMap),
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
        relatedObjects: [],
        hasMoreRelatedObjects: true,
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
      const categoryName = action.meta;
      const categoryData = action.payload || {};

      const { tags: newTags = [], hasMore = false } = categoryData;

      const existingCategoryData =
        state.categoryTags[categoryName] ||
        state.tagCategories.find(cat => {
          const catName = typeof cat === 'object' ? cat.tagCategory : cat;

          return catName === categoryName;
        });

      const existingTags =
        existingCategoryData?.tags ||
        (typeof existingCategoryData === 'object' ? existingCategoryData.tags : []);

      const updatedTags = uniq([...existingTags, ...newTags]);

      const tagsFilter = [...state.tagsForFilter];
      const matchIndex = tagsFilter.findIndex(category => {
        const catName = typeof category === 'object' ? category.tagCategory : category;

        return catName === categoryName;
      });

      if (matchIndex !== -1) {
        tagsFilter.splice(matchIndex, 1, {
          tagCategory: categoryName,
          tags: updatedTags,
          hasMore,
        });
      } else {
        tagsFilter.push({
          tagCategory: categoryName,
          tags: updatedTags,
          hasMore,
        });
      }

      const updatedCategoryTags = {
        ...state.categoryTags,
        [categoryName]: {
          tags: updatedTags,
          hasMore,
        },
      };

      const updatedTagCategories = state.tagCategories.map(category => {
        const catName = typeof category === 'object' ? category.tagCategory : category;

        if (catName === categoryName) {
          return { tagCategory: categoryName, tags: updatedTags, hasMore };
        }

        return category;
      });

      return {
        ...state,
        tagsForFilter: [...tagsFilter],
        categoryTags: updatedCategoryTags,
        tagCategories: updatedTagCategories,
      };
    }

    case wobjTypeActions.GET_TAG_CATEGORIES.START:
      return {
        ...state,
        tagCategoriesFetching: true,
      };

    case wobjTypeActions.GET_TAG_CATEGORIES.SUCCESS: {
      const categories = action.payload || [];
      const categoryTagsMap = {};

      categories.forEach(category => {
        categoryTagsMap[category.tagCategory] = {
          tags: category.tags || [],
          hasMore: category.hasMore || false,
        };
      });

      return {
        ...state,
        tagCategories: categories,
        categoryTags: categoryTagsMap,
        tagsForFilter: categories,
        tagCategoriesFetching: false,
      };
    }

    case wobjTypeActions.GET_TAG_CATEGORIES.ERROR:
      return {
        ...state,
        tagCategoriesFetching: false,
      };

    case wobjTypeActions.GET_TAGS_BY_CATEGORY.SUCCESS: {
      const categoryName = action.meta;
      const tags = action.payload?.tags || [];
      const hasMore = action.payload?.hasMore || false;

      const updatedTagCategories = state.tagCategories.map(category => {
        const catName = typeof category === 'object' ? category.tagCategory : category;

        if (catName === categoryName) {
          return { tagCategory: categoryName, tags, hasMore };
        }

        return category;
      });

      return {
        ...state,
        categoryTags: {
          ...state.categoryTags,
          [categoryName]: { tags, hasMore },
        },
        tagCategories: updatedTagCategories,
        tagsForFilter: [
          ...state.tagsForFilter.filter(item => {
            const itemName = typeof item === 'object' ? item.tagCategory : item;

            return itemName !== categoryName;
          }),
          { tagCategory: categoryName, tags, hasMore },
        ],
      };
    }

    case wobjTypeActions.SET_ACTIVE_TAGS_FILTERS:
      return {
        ...state,
        activeTagsFilters: action.payload,
        filteredObjects: [],
      };

    case wobjTypeActions.SET_OBJECT_SORT_TYPE:
      return {
        ...state,
        sort: action.payload,
        filteredObjects: [],
        hasMoreRelatedObjects: true,
      };

    case wobjTypeActions.GET_OBJECT_TYPE_BY_NAME.SUCCESS: {
      return {
        ...state,
        relatedObjects: uniqBy(action.payload?.related_wobjects, 'author_permlink'),
        hasMoreRelatedObjects: action.payload?.hasMoreWobjects,
      };
    }

    case wobjTypeActions.GET_OBJECT_TYPE_BY_NAME_MORE.SUCCESS: {
      return {
        ...state,
        relatedObjects: uniqBy(
          [...state.relatedObjects, ...action.payload?.related_wobjects],
          'author_permlink',
        ),
        hasMoreRelatedObjects: action.payload?.hasMoreWobjects,
      };
    }

    case wobjTypeActions.RESET_OBJECTS: {
      return {
        ...state,
        relatedObjects: [],
        filteredObjects: [],
        hasMoreRelatedObjects: true,
      };
    }

    default:
      return state;
  }
};

export default objectType;
