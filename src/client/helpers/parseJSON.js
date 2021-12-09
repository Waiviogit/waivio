export const parseJSON = value => {
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

export default null;
