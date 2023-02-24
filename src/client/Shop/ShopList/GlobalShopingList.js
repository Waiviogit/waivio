import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import ShopList from './ShopList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import ShopDepartmentsList from '../ShopDepartments/ShopDepartmentsList';

const GlobalShopingList = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <ShopList setVisibleNavig={onOpen} userName={authUserName} path={match.url}>
      {visibleNavig && <ShopDepartmentsList visible={visibleNavig} onClose={onClose} />}
    </ShopList>
  );
};

export default GlobalShopingList;
