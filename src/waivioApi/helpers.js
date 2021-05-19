export const createQuery = queryObject =>
  Object.keys(queryObject).reduce((acc, value) => {
    if (queryObject[value]) {
      return acc ? `${acc}&${value}=${queryObject[value]}` : `${value}=${queryObject[value]}`;
    }

    return acc;
  }, '');

export default null;
