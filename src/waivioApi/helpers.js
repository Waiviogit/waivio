import { isEmpty } from 'lodash';

export const createQuery = queryObject =>
  Object.keys(queryObject).reduce((acc, value) => {
    if (!isEmpty(queryObject[value]) || queryObject[value]) {
      return acc ? `${acc}&${value}=${queryObject[value]}` : `${value}=${queryObject[value]}`;
    }

    return acc;
  }, '');

export const parseQuery = queryString => {
  const u = new URLSearchParams(queryString);

  return Array.from(u.keys()).reduce((acc, curr) => {
    acc[curr] = u.get(curr).split(',');

    return acc;
  }, {});
};

export const parseQueryForFilters = query => {
  const parsedQuery = parseQuery(query.toString());

  return Object.keys(parsedQuery).reduce(
    (acc, curr) => {
      if (curr === 'rating') return { ...acc, rating: +parsedQuery.rating };

      return {
        ...acc,
        tagCategory: [
          ...acc.tagCategory,
          {
            categoryName: curr,
            tags: parsedQuery[curr],
          },
        ],
      };
    },
    { tagCategory: [] },
  );
};

export const getQueryString = query => (query ? `?${query}` : '');

export default null;
