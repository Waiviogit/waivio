import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import DepartmentsWobjList from './DepartmentsWobjList';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import DepartmentsUser from '../ShopDepartments/DepartmentsUser';

const UserDepartmentsWobjList = () => {
  const match = useRouteMatch();
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <DepartmentsWobjList
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      setVisibleNavig={onOpen}
      path={`/@${match.params.name}/userShop`}
    >
      {visibleNavig && <DepartmentsUser visible={visibleNavig} onClose={onClose} />}
    </DepartmentsWobjList>
  );
};

export default UserDepartmentsWobjList;
