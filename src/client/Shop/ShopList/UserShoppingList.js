import React, { useState } from 'react';
import { useRouteMatch } from 'react-router';

import ShopList from './ShopList';
import DepartmentsUser from '../DepartmentsUser/DepartmentsUser';
import { getUserShopMainFeed } from '../../../waivioApi/ApiClient';

const UserShoppingList = () => {
  const match = useRouteMatch();
  const [visibleNavig, setVisibleNavig] = useState(false);
  const onOpen = () => setVisibleNavig(true);
  const onClose = () => setVisibleNavig(false);

  return (
    <ShopList
      userName={match.params.name}
      path={match.url}
      setVisibleNavig={onOpen}
      getShopFeed={getUserShopMainFeed}
    >
      {visibleNavig && <DepartmentsUser visible={visibleNavig} onClose={onClose} />}
    </ShopList>
  );
};

export default UserShoppingList;
