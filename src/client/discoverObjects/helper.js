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
  delete parseSearchParams.sort;

  const mappedFilter = Object.keys(parseSearchParams)
    .filter(category => category !== 'sort')
    .map(category => {
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
  delete parseSearchParams.sort;

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

  const sort = params.get('sort');

  params.delete('category');
  params.delete('tag');

  const nonTagCategoryParams = ['searchString', 'rating', 'map', 'search'];

  Object.keys(activeTags).forEach(category => {
    const filtersValue = activeTags[category];
    const categoryName = category === 'searchString' ? 'search' : category;

    if (isEmpty(filtersValue)) {
      params.delete(categoryName);

      return;
    }

    const value = isArray(filtersValue) ? filtersValue.join(',') : filtersValue;

    if (nonTagCategoryParams.includes(category)) {
      params.set(categoryName, value);
    } else if (isArray(filtersValue)) {
      filtersValue.forEach(tag => {
        if (tag) {
          params.append('category', categoryName);
          params.append('tag', tag);
        }
      });
    } else if (value) {
      value.split(',').forEach(tag => {
        const trimmedTag = tag.trim();

        if (trimmedTag) {
          params.append('category', categoryName);
          params.append('tag', trimmedTag);
        }
      });
    }
  });

  if (sort && sort !== 'reverse_recency') {
    params.set('sort', sort);
  }

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

export const parseDiscoverTagsFilters = search => {
  const params = new URLSearchParams(search);
  const categories = params.getAll('category');
  const tags = params.getAll('tag');

  const result = {};

  categories.forEach((cat, index) => {
    const tag = tags[index];

    if (!cat || !tag || cat === 'sort') return;

    if (!result[cat]) {
      result[cat] = [];
    }

    if (!result[cat].includes(tag)) {
      result[cat].push(tag);
    }
  });

  return result;
};

export const parseDiscoverQuery = search => {
  const params = new URLSearchParams(search);

  return {
    search: params.get('search') || '',
    category: params.get('category') || null,
    tagsByCategory: parseDiscoverTagsFilters(search),
    sort: params.get('sort') || 'reverse_recency',
  };
};

export const buildCanonicalSearch = ({ search, tagsByCategory, sort }) => {
  const params = new URLSearchParams();

  if (search) {
    params.set('search', search);
  }

  if (sort && sort !== 'reverse_recency') {
    params.set('sort', sort);
  }

  Object.entries(tagsByCategory || {}).forEach(([cat, tags]) => {
    if (cat === 'sort') return;

    (tags || []).forEach(tag => {
      if (tag) {
        params.append('category', cat);
        params.append('tag', tag);
      }
    });
  });

  return params.toString();
};

export const getPlural = word => {
  const lowerWord = word.toLowerCase();

  if (
    lowerWord.endsWith('y') &&
    !['ay', 'ey', 'iy', 'oy', 'uy'].some(ending => lowerWord.endsWith(ending))
  ) {
    return `${lowerWord.slice(0, -1)}ies`;
  }
  if (['s', 'x', 'z', 'ch', 'sh'].some(ending => lowerWord.endsWith(ending))) {
    return `${lowerWord}es`;
  }

  return `${lowerWord}s`;
};

export default {
  updateActiveFilters,
  isNeedFilters,
};
