import { forEach, isEmpty } from 'lodash';
import classNames from 'classnames';
import {AutoComplete, Icon} from "antd";
import React from "react";

export const getTranformSearchCountData = (searchResults, listOfObjectTypes, withAll = false) => {
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

  if (countArr.length && withAll) {
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

export const userToggleFollow = (userList, userName, obj) => {
  const findExpert = userList.findIndex(user => user.account === userName);

  userList.splice(findExpert, 1, {
    ...userList[findExpert],
    ...obj,
  });

  return userList;
};

export const pendingSearch = (searchString, intl) => {
  const downBar = (
    <AutoComplete.Option disabled key="all" className="Topnav__search-pending">
      <div className="pending-status">
        {intl.formatMessage(
          {
            id: 'search_all_results_for',
            defaultMessage: 'Search all results for {search}...',
          },
          { search: searchString },
        )}
        {<span> &nbsp;</span>}
        {<Icon type="loading" />}
      </div>
    </AutoComplete.Option>
  );
  return [downBar];
};

export default null;
