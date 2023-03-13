import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import DepartmentsWobjList from '../../Shop/DepartmentsWobjList/DepartmentsWobjList';
import { getWobjectDepartmentsFeed } from '../../../waivioApi/ApiClient';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const ObjectDepartmentsWobjList = () => {
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const authUserName = useSelector(getAuthenticatedUserName);
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);
  const getDepartmentsFeed = () =>
    getWobjectDepartmentsFeed(authorPermlink, match.params.department, authUserName);

  return (
    <DepartmentsWobjList
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      setVisibleNavig={onOpen}
      path={`/object/${match.params.name}/shop`}
    >
      {visibleNavig && <DepartmentsUser visible={visibleNavig} onClose={onClose} />}
    </DepartmentsWobjList>
  );
};

export default ObjectDepartmentsWobjList;
