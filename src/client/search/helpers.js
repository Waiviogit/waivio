import { forEach, isEmpty } from 'lodash';
import classNames from 'classnames';

export const getTranformSearchCountData = (searchResults, listOfObjectTypes) => {
  const { objectTypesCount, wobjectsCounts, usersCount } = searchResults;

  const countArr = [];

  if (!isEmpty(wobjectsCounts)) {
    const wobjList = listOfObjectTypes.reduce((acc, i) => {
      const index = wobjectsCounts.findIndex(obj => obj.object_type === i);

      if (index >= 0) {
        acc.push(wobjectsCounts[index]);
      }

      return acc;
    }, []);

    forEach(wobjList, current => {
      const obj = {};

      obj.name = current.object_type;
      obj.count = current.count;
      obj.type = 'wobject';
      countArr.push(obj);
    });
  }

  if (objectTypesCount) countArr.push({ name: 'Types', count: objectTypesCount, type: 'type' });

  if (usersCount) countArr.push({ name: 'Users', count: usersCount, type: 'user' });

  if (countArr.length) {
    const calcAllResult = countArr.reduce((acc, curr) => acc + curr.count, 0);

    countArr.unshift({
      name: 'All',
      count: calcAllResult,
      type: 'all',
    });
  }

  return countArr;
};

export const getActiveItemClassList = (curr, type, className) =>
  classNames(className, {
    [`${className}--active`]: type === curr,
  });

export default null;
