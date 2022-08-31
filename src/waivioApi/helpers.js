export const createQuery = queryObject =>
  Object.keys(queryObject).reduce((acc, value) => {
    if (queryObject[value]) {
      return acc ? `${acc}&${value}=${queryObject[value]}` : `${value}=${queryObject[value]}`;
    }

    return acc;
  }, '');

export const parseQuery = queryString => {
  const c = queryString.split('&').filter(value => value);

  return c.reduce((acc, curr) => {
    const h = curr.split('=');

    acc[h[0]] = h[1].split('%2C');

    return acc;
  }, {});
};

export default null;
