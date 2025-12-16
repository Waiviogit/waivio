import { isEmpty, uniq, isArray } from 'lodash';
import OBJ_TYPES from '../object/const/objectTypes';
import { parseJSON } from '../../common/helpers/parseJSON';

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

  return parseJSON(`{"${parseSearchParams}"}`);
};

export const createFilterBody = parseObject => {
  const parseSearchParams = { ...parseObject };

  delete parseSearchParams.rating;
  delete parseSearchParams.search;
  delete parseSearchParams.searchString;
  delete parseSearchParams.center;
  delete parseSearchParams.zoom;
  delete parseSearchParams.permlink;
  delete parseSearchParams.type;
  delete parseSearchParams.access_token;
  delete parseSearchParams.socialProvider;
  delete parseSearchParams.showPanel;

  const mappedFilter = Object.keys(parseSearchParams).map(category => {
    let tags = parseSearchParams[category];

    if (typeof tags === 'string') {
      if (tags.includes('%')) {
        try {
          tags = decodeURIComponent(tags);
        } catch (error) {
          console.error(error);
        }
      }

      tags = tags.replace(/^["']|["']$/g, '');

      tags = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    } else if (isArray(tags)) {
      const expandedTags = [];

      tags.forEach(tag => {
        if (typeof tag === 'string') {
          let decodedTag = tag;

          if (tag.includes('%')) {
            try {
              decodedTag = decodeURIComponent(tag);
            } catch (error) {
              decodedTag = tag;
            }
          }
          decodedTag = decodedTag.replace(/^["']|["']$/g, '');
          if (decodedTag.includes(',')) {
            const splitTags = decodedTag
              .split(',')
              .map(t => t.trim())
              .filter(t => t.length > 0);

            expandedTags.push(...splitTags);
          } else {
            expandedTags.push(decodedTag.trim());
          }
        } else {
          expandedTags.push(tag);
        }
      });
      tags = expandedTags.filter(tag => tag && tag.length > 0);
    }

    return {
      categoryName: category.replace('%20', ' ').replace('+', ' '),
      tags,
    };
  });

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

  if (!parseSearchParams) return {};

  delete parseSearchParams.rating;
  delete parseSearchParams.search;
  delete parseSearchParams.mapX;
  delete parseSearchParams.mapY;
  delete parseSearchParams.showPanel;
  delete parseSearchParams.radius;
  delete parseSearchParams.zoom;

  return Object.keys(parseSearchParams).reduce((acc, category) => {
    let value = parseSearchParams[category];

    if (typeof value === 'string') {
      if (value.includes('%')) {
        try {
          value = decodeURIComponent(value);
        } catch (error) {
          console.error(error);
        }
      }
      value = value.replace(/^["']|["']$/g, '');
      value = value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    }

    return {
      ...acc,
      [category.replace(' ', '%20')]: value,
    };
  }, {});
};

export const changeUrl = (activeTags, history, location) => {
  const params = new URLSearchParams(location.search);

  Object.keys(activeTags).forEach(category => {
    const filtersValue = activeTags[category];
    const categoryName = category === 'searchString' ? 'search' : category;

    if (isEmpty(filtersValue)) {
      params.delete(categoryName);

      return;
    }

    const value = isArray(filtersValue) ? filtersValue.join(',') : filtersValue;

    params.set(categoryName, value);
  });

  const encoded = params.toString().replace(/\+/g, '%20');

  const newUrl = encoded ? `?${encoded}` : '';

  if (newUrl !== location.search) {
    if (newUrl) {
      history.push(`${location.pathname}${newUrl}`);
    } else {
      history.push(location.pathname);
    }
  }
};

export default {
  updateActiveFilters,
  isNeedFilters,
};
