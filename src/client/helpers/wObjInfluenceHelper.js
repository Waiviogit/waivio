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
    if (res[currIndex + 1].influence.value + dxInfluence > 0) {
      res[currIndex + 1].influence.value += dxInfluence;
      res[currIndex].influence.value -= dxInfluence;
    } else if (res[currIndex - 1] && res[currIndex - 1].influence.value + dxInfluence > 0) {
      res[currIndex - 1].influence.value += dxInfluence;
      res[currIndex].influence.value -= dxInfluence;
    }
  } else if (objArr[currIndex - 1]) {
    const dxInfluence = res[currIndex].influence.value - influence;
    if (res[currIndex - 1].influence.value + dxInfluence > 0) {
      res[currIndex - 1].influence.value += dxInfluence;
      res[currIndex].influence.value -= dxInfluence;
    }
  }
  return res;
};

export const removeObjInfluenceHandler = (objArr, removingObj) => {
  const filtered = objArr
    .filter(obj => obj.tag !== removingObj.tag)
    .map(obj => ({ ...obj, influence: { ...obj.influence, max: obj.influence.max + 1 } }));
  const removingObjInfluence = removingObj.influence.value;
  for (let i = 0, remainInfluence = removingObjInfluence; i < filtered.length; i += 1) {
    const currInfluence = filtered[i].influence.value;
    const influenceToAdd =
      Math.round((currInfluence * 100) / (100 - removingObjInfluence)) - currInfluence;
    filtered[i].influence.value +=
      influenceToAdd <= remainInfluence ? influenceToAdd : remainInfluence;
    remainInfluence -= influenceToAdd;
  }
  return filtered;
};
