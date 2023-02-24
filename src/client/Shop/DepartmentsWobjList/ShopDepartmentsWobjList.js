import React from 'react';
import { useSelector } from 'react-redux';

import DepartmentsWobjList from './DepartmentsWobjList';
import { getShopDepartmentFeed } from '../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const ShopDepartmentsWobjList = () => {
  const authUser = useSelector(getAuthenticatedUserName);

  return <DepartmentsWobjList user={authUser} getDepartmentsFeed={getShopDepartmentFeed} />;
};

export default ShopDepartmentsWobjList;
