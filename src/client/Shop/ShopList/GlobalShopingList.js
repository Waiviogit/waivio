import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import ShopList from './ShopList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import { getShopMainFeed } from '../../../waivioApi/ApiClient';
import GlobalShopDepartments from '../ShopDepartments/GlobalShopDepartments';

const GlobalShopingList = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <ShopList
      setVisibleNavig={onOpen}
      userName={authUserName}
      path={match.url}
      getShopFeed={getShopMainFeed}
    >
      {visibleNavig && <GlobalShopDepartments visible={visibleNavig} onClose={onClose} />}
    </ShopList>
  );
};

export default GlobalShopingList;
