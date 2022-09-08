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

export default null;
