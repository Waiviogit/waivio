import React from 'react';
import { useRouteMatch } from 'react-router';

import ShopList from './ShopList';

const UserShoppingList = () => {
  const match = useRouteMatch();

  return <ShopList userName={match.params.name} path={match.url} />;
};

export default UserShoppingList;
