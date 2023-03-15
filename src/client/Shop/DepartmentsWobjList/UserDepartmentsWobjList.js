import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import DepartmentsUser from '../ShopDepartments/DepartmentsUser';
import UserFilters from '../ShopFilters/UserFilters';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const UserDepartmentsWobjList = () => {
  const match = useRouteMatch();
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <ListSwitcher
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      setVisibleNavig={onOpen}
      path={`/@${match.params.name}/userShop`}
      filter={UserFilters}
      type={'user'}
    >
      {visibleNavig && <DepartmentsUser visible={visibleNavig} onClose={onClose} />}
    </ListSwitcher>
  );
};

export default UserDepartmentsWobjList;
