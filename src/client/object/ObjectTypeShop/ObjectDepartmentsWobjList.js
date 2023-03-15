import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import { getWobjectDepartmentsFeed } from '../../../waivioApi/ApiClient';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ListSwitcher from '../../Shop/ListSwitch/ListSwitcher';

const ObjectDepartmentsWobjList = () => {
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const authUserName = useSelector(getAuthenticatedUserName);
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);
  const getDepartmentsFeed = (user, authUser, departments, filters, path, skip, limit) =>
    getWobjectDepartmentsFeed(
      authorPermlink,
      match.params.department,
      authUserName,
      path,
      skip,
      limit,
      path,
    );

  return (
    <ListSwitcher
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      setVisibleNavig={onOpen}
      path={`/object/${match.params.name}/shop`}
      type={'wobject'}
    >
      {visibleNavig && <DepartmentsUser visible={visibleNavig} onClose={onClose} />}
    </ListSwitcher>
  );
};

export default ObjectDepartmentsWobjList;
