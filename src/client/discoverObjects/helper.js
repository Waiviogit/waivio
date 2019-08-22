import { uniq } from 'lodash';

export function updateActiveFilters(activeFilters, filter, value, isActive) {
  return {
    ...activeFilters,
    [filter]: isActive
      ? uniq([...activeFilters[filter], value])
      : activeFilters[filter].filter(filterValue => filterValue !== value),
  };
}

export function isNeedFilters(objectType) {
  return !['hashtag', 'list', 'page'].some(type => type === objectType);
}

export default {
  updateActiveFilters,
  isNeedFilters,
};
