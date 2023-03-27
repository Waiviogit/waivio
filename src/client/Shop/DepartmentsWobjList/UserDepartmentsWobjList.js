import React from 'react';
import { useRouteMatch } from 'react-router';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import UserFilters from '../ShopFilters/UserFilters';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const UserDepartmentsWobjList = () => {
  const match = useRouteMatch();

  return (
    <ListSwitcher
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={`/@${match.params.name}/userShop`}
      Filter={UserFilters}
      type={'user'}
    />
  );
};

export default UserDepartmentsWobjList;
