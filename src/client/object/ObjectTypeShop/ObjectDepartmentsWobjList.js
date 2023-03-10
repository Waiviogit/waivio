import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import DepartmentsWobjList from '../../Shop/DepartmentsWobjList/DepartmentsWobjList';
import { getWobjectDepartmentsFeed } from '../../../waivioApi/ApiClient';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';

const ObjectDepartmentsWobjList = () => {
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);
  const getDepartmentsFeed = () =>
    getWobjectDepartmentsFeed(authorPermlink, match.params.department);

  return (
    <DepartmentsWobjList
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      setVisibleNavig={onOpen}
      path={match.url}
    >
      {visibleNavig && <DepartmentsUser visible={visibleNavig} onClose={onClose} />}
    </DepartmentsWobjList>
  );
};

export default ObjectDepartmentsWobjList;
