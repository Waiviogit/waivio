import { uniq } from 'lodash';
import OBJ_TYPES from '../object/const/objectTypes';

export function updateActiveFilters(activeFilters, filter, value, isActive) {
  return {
    ...activeFilters,
    [filter]: isActive
      ? uniq([...activeFilters[filter], value])
      : activeFilters[filter].filter(filterValue => filterValue !== value),
  };
}

export function isNeedFilters(objectType) {
  return ![OBJ_TYPES.HASHTAG, OBJ_TYPES.LIST, OBJ_TYPES.PAGE].some(type => type === objectType);
}

export default {
  updateActiveFilters,
  isNeedFilters,
};
