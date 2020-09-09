import { uniq } from 'lodash';
import OBJ_TYPES from '../object/const/objectTypes';

export function updateActiveFilters(activeFilters, filter, value, isActive) {
  if (!activeFilters[filter]) return { ...activeFilters, [filter]: [value] };

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

export const parseUrl = url => {
  if (!url) return '';

  const parseSearchParams = url
    .split('&')
    .map(search => search.replace('=', '": "').replace('?', '"'))
    .join('", "');

  return JSON.parse(`{"${parseSearchParams}"}`);
};

export const createFilterBody = url => {
  const parseSearchParams = parseUrl(url);

  return Object.keys(parseSearchParams).map(category => ({
    categoryName: category,
    tags: parseSearchParams[category].split(','),
  }));
};

export default {
  updateActiveFilters,
  isNeedFilters,
};
