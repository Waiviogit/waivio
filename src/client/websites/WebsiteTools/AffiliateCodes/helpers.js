export const createCodesList = (codes, percents, weightBuffer) => {
  if (codes.length === 1) return codes;

  return codes.reduce((acc, curr, i) => {
    if (i && !percents[i - 1]) return acc;

    if (i && !curr) {
      acc.splice(0, 1, `${codes[0]}::${weightBuffer + percents[i - 1]}`);

      return acc;
    }

    return i ? [...acc, `${curr}::${percents[i - 1]}`] : [`${curr}::${weightBuffer}`];
  }, []);
};

export default null;
