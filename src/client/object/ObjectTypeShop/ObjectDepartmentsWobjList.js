import React from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import { getWobjectDepartmentsFeed } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ListSwitcher from '../../Shop/ListSwitch/ListSwitcher';

const ObjectDepartmentsWobjList = () => {
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const authUserName = useSelector(getAuthenticatedUserName);
  const getDepartmentsFeed = (user, authUser, departments, filters, path, skip, limit) =>
    getWobjectDepartmentsFeed(
      authorPermlink,
      match.params.department,
      authUserName,
      departments,
      filters,
      path,
      skip,
      limit,
    );

  return (
    <ListSwitcher
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={`/object/${match.params.name}/shop`}
      type={'wobject'}
    />
  );
};

export default ObjectDepartmentsWobjList;
