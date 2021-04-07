import { get } from 'lodash';
import { createSelector } from 'reselect';

// selector
export const objectTypeState = state => state.objectType;

// reselect function
export const getObjectTypeState = createSelector([objectTypeState], state => state.data);

export const getObjectTypeLoading = createSelector([objectTypeState], state => state.fetching);

export const getFilteredObjects = createSelector([objectTypeState], state => state.filteredObjects);

export const getFilteredObjectsMap = createSelector([objectTypeState], state => state.mapWobjects);

export const getUpdatedMapDiscover = createSelector([objectTypeState], state => state.updated);

export const getHasMoreRelatedObjects = createSelector(
  [objectTypeState],
  state => state.hasMoreRelatedObjects,
);

export const getAvailableFilters = createSelector([objectTypeState], state => state.filtersList);

export const getActiveFilters = createSelector([objectTypeState], state => state.activeFilters);

export const getTypeName = createSelector([getObjectTypeState], data =>
  get(data, 'activeFilters', ''),
);

export const getHasMap = createSelector([objectTypeState], state => state.map);

export const getObjectTypeSorting = createSelector([objectTypeState], state => state.sort);

export const getFiltersTags = createSelector([objectTypeState], state => state.tagsForFilter);

export const getActiveFiltersTags = createSelector(
  [objectTypeState],
  state => state.activeTagsFilters,
);
