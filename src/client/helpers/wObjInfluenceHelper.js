export const setInitialInfluence = objArr => {
  const result = [];
  if (objArr.length) {
    const maxValue = 100 - objArr.length + 1;
    for (let i = 0, influence = 100; i < objArr.length; i += 1) {
      if (objArr[i + 1]) {
        const currInfluence = Math.ceil(influence / 2);
        result.push({ ...objArr[i], influence: { value: currInfluence, max: maxValue } });
        influence -= currInfluence;
      } else {
        result.push({ ...objArr[i], influence: { value: influence, max: maxValue } });
      }
    }
  }
  return result;
};

export const changeObjInfluenceHandler = (objArr, currObj, influence) => {
  const res = [...objArr];
  const currIndex = objArr.indexOf(currObj);
  if (objArr[currIndex + 1]) {
    const dxInfluence = res[currIndex].influence.value - influence;
    res[currIndex].influence.value -= dxInfluence;
    res[currIndex + 1].influence.value += dxInfluence;
  }
  return res;
};
