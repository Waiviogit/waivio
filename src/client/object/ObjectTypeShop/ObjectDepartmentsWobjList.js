import React from 'react';
import { useRouteMatch } from 'react-router';

import { getWobjectDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ListSwitcher from '../../Shop/ListSwitch/ListSwitcher';

const ObjectDepartmentsWobjList = () => {
  const match = useRouteMatch();

  const getDepartmentsFeed = (
    authorPermlink,
    user,
    authUser,
    department,
    filters,
    path,
    skip,
    limit,
  ) => getWobjectDepartmentsFeed(authorPermlink, department, authUser, filters, path, skip, limit);

  return (
    <ListSwitcher
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={
        match.url.includes('object-shop')
          ? `/object-shop/${match.params.name}`
          : `/object/${match.params.name}/shop`
      }
      type={'wobject'}
    />
  );
};

ObjectDepartmentsWobjList.propTypes = {};

export default ObjectDepartmentsWobjList;
