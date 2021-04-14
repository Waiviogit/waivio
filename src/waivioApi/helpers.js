export const createQuery = queryObject =>
  Object.keys(queryObject).reduce(
    (acc, value) =>
      acc ? `${acc}&${value}=${queryObject[value]}` : `${value}=${queryObject[value]}`,
    '',
  );

export default null;
