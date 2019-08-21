import { uniq } from 'lodash';

export function updateActiveFilters(activeFilters, filter, value, isActive) {
  return {
    ...activeFilters,
    [filter]: isActive
      ? uniq([...activeFilters[filter], value])
      : activeFilters[filter].filter(filterValue => filterValue !== value),
  };
}

export default {
  updateActiveFilters,
};
