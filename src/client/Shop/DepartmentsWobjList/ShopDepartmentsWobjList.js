import React from 'react';
import { useSelector } from 'react-redux';

import { getShopDepartmentFeed } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const ShopDepartmentsWobjList = () => {
  const authUser = useSelector(getAuthenticatedUserName);

  return <ListSwitcher user={authUser} getDepartmentsFeed={getShopDepartmentFeed} path={'/shop'} />;
};

export default ShopDepartmentsWobjList;
