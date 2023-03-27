import React from 'react';
import { useRouteMatch } from 'react-router';

import ShopList from './ShopList';
import { getUserShopMainFeed } from '../../../waivioApi/ApiClient';
import UserFilters from '../ShopFilters/UserFilters';

const UserShoppingList = () => {
  const match = useRouteMatch();

  return (
    <ShopList
      userName={match.params.name}
      path={match.url}
      getShopFeed={getUserShopMainFeed}
      Filter={UserFilters}
    />
  );
};

export default UserShoppingList;
