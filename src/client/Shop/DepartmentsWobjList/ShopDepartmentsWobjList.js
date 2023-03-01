import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import DepartmentsWobjList from './DepartmentsWobjList';
import { getShopDepartmentFeed } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import GlobalShopDepartments from '../ShopDepartments/GlobalShopDepartments';

const ShopDepartmentsWobjList = () => {
  const authUser = useSelector(getAuthenticatedUserName);
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <DepartmentsWobjList
      user={authUser}
      getDepartmentsFeed={getShopDepartmentFeed}
      setVisibleNavig={onOpen}
      path={'/shop'}
    >
      <GlobalShopDepartments visible={visibleNavig} onClose={onClose} />
    </DepartmentsWobjList>
  );
};

export default ShopDepartmentsWobjList;
