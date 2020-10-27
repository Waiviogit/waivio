import { isEmpty, uniq, isArray } from 'lodash';
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
    .map(search => search.replace('=', '": "').replace('?', ''))
    .join('", "');

  return JSON.parse(`{"${parseSearchParams}"}`);
};

export const createFilterBody = parseObject => {
  const parseSearchParams = { ...parseObject };

  delete parseSearchParams.rating;
  delete parseSearchParams.search;

  const mappedFilter = Object.keys(parseSearchParams).map(category => ({
    categoryName: category.replace('%20', ' '),
    tags:
      typeof parseSearchParams[category] === 'string'
        ? parseSearchParams[category].split(',')
        : parseSearchParams[category],
  }));

  return mappedFilter.filter(filter => !isEmpty(filter.tags));
};

export const updateActiveTagsFilters = (activeTagsFilters, filterValue, value, checked) => {
  const filter = value.replace(' ', '%20');

  if (!activeTagsFilters[filter])
    return {
      ...activeTagsFilters,
      [filter]: [filterValue],
    };

  return {
    ...activeTagsFilters,
    [filter]: checked
      ? [...activeTagsFilters[filter], filterValue]
      : activeTagsFilters[filter].filter(tag => tag !== filterValue),
  };
};

export const parseTagsFilters = url => {
  const parseSearchParams = parseUrl(url);

  delete parseSearchParams.rating;
  delete parseSearchParams.search;

  return Object.keys(parseSearchParams).reduce(
    (acc, category) => ({
      ...acc,
      [category.replace(' ', '%20')]: parseSearchParams[category].split(','),
    }),
    {},
  );
};

export const changeUrl = (activeTags, history, location) => {
  const newUrl = Object.keys(activeTags).reduce((acc, category) => {
    const filtersValue = activeTags[category];

    if (isEmpty(filtersValue)) return acc;

    const categoryInfo = isArray(filtersValue) ? filtersValue.join(',') : filtersValue;
    const categoryName = category === 'searchString' ? 'search' : category;

    return acc ? `${acc}&${categoryName}=${categoryInfo}` : `?${categoryName}=${categoryInfo}`;
  }, '');

  if (newUrl !== location.search) {
    if (newUrl) history.push(newUrl);
    else history.push(location.pathname);
  }
};

export default {
  updateActiveFilters,
  isNeedFilters,
};
