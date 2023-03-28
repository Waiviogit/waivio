import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import ShopList from './ShopList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import { getShopMainFeed } from '../../../waivioApi/ApiClient';

const GlobalShopingList = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();

  return <ShopList userName={authUserName} path={match.url} getShopFeed={getShopMainFeed} />;
};

export default GlobalShopingList;
