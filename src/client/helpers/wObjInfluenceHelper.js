export const setInitialInfluence = (objArr, wObj, influenceRemain) => {
  const result = [...objArr];
  const arrLen = result.length;

  if (arrLen) {
    const lastObj = result[arrLen - 1];
    if (influenceRemain > 0) {
      result.push({ ...wObj, influence: { value: influenceRemain } });
    } else if (lastObj && lastObj.influence.value > 1) {
      const currInfluence = Math.floor(lastObj.influence.value / 2);
      result[arrLen - 1].influence.value -= currInfluence;
      result[arrLen] = { ...wObj, influence: { value: currInfluence } };
    } else {
      for (let i = result.length - 1; i >= 0; i -= 1) {
        if (result[i].influence.value > 1) {
          result[i].influence.value -= 1;
          result[result.length] = { ...wObj, influence: { value: 1 } };
          break;
        }
      }
    }
  } else {
    result.push({ ...wObj, influence: { value: 100, max: 100 } });
  }
  for (let i = 0; i < result.length; i += 1) {
    result[i].influence.max = result[i].influence.value;
  }

  return result;
};

export const changeObjInfluenceHandler = (objArr, currObj, influence, influenceRemain) => {
  const dxInfluence = currObj.influence.value - influence;
  const influenceRemainNext = influenceRemain + dxInfluence;
  if (influenceRemainNext >= 0) {
    const resultArr = objArr.map(obj =>
      obj.id === currObj.id
        ? {
            ...obj,
            influence: {
              value: influence,
              max: influence + influenceRemainNext,
            },
          }
        : {
            ...obj,
            influence: {
              value: obj.influence.value,
              max: obj.influence.value + influenceRemainNext,
            },
          },
    );
    return { linkedObjects: resultArr, influenceRemain: influenceRemainNext };
  }
  return null;
};

export const removeObjInfluenceHandler = (objArr, removingObj, influenceRemain) => {
  const filtered = objArr
    .filter(obj => obj.id !== removingObj.id)
    .map(obj => ({
      ...obj,
      influence: { ...obj.influence, max: obj.influence.max + removingObj.influence.value },
    }));
  if (filtered.length === 1) {
    const lastObj = filtered[0];
    return {
      linkedObjects: [{ ...lastObj, influence: { value: 100, max: 100 } }],
      influenceRemain: 0,
    };
  }
  const influenceRemainNext = influenceRemain + removingObj.influence.value;

  return { linkedObjects: filtered, influenceRemain: filtered.length ? influenceRemainNext : 0 };
};
