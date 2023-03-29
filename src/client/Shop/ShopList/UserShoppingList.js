import React from 'react';
import { useRouteMatch } from 'react-router';
import ShopList from './ShopList';
import { getUserShopMainFeed } from '../../../waivioApi/ApiClient';

const UserShoppingList = () => {
  const match = useRouteMatch();

  return (
    <ShopList userName={match.params.name} path={match.url} getShopFeed={getUserShopMainFeed} />
  );
};

export default UserShoppingList;
