import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { getShopDepartmentFeed } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import GlobalShopDepartments from '../ShopDepartments/GlobalShopDepartments';
import GlobalShopFilters from '../ShopFilters/GlobalShopFilters';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const ShopDepartmentsWobjList = () => {
  const authUser = useSelector(getAuthenticatedUserName);
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <ListSwitcher
      user={authUser}
      getDepartmentsFeed={getShopDepartmentFeed}
      setVisibleNavig={onOpen}
      path={'/shop'}
      Filter={GlobalShopFilters}
    >
      {visibleNavig && <GlobalShopDepartments visible={visibleNavig} onClose={onClose} />}
    </ListSwitcher>
  );
};

export default ShopDepartmentsWobjList;
