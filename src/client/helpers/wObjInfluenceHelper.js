export const setInitialInfluence = (objArr, wObj) => {
  const res = [...objArr];
  if (res.length) {
    const maxValue = 100 - objArr.length;
    const lastObj = res[res.length - 1];
    if (lastObj && lastObj.influence.value > 1) {
      const currInfluence = Math.floor(lastObj.influence.value / 2);
      res[res.length - 1] = {
        ...lastObj,
        influence: { value: lastObj.influence.value - currInfluence },
      };
      res[res.length] = { ...wObj, influence: { value: currInfluence } };
    } else {
      for (let i = res.length - 1; i >= 0; i -= 1) {
        if (res[i].influence.value > 1) {
          const currObj = res[i];
          res[i] = { ...currObj, influence: { value: currObj.influence.value - 1 } };
          res[res.length] = { ...wObj, influence: { value: 1 } };
          break;
        }
      }
    }
    for (let i = 0; i < res.length; i += 1) {
      res[i].influence.max = maxValue;
    }
  } else {
    return [{ ...wObj, influence: { value: 100, max: 100 } }];
  }
  return res;
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
