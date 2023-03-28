import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ShopList from '../../Shop/ShopList/ShopList';
import { getWobjectShopMainFeed } from '../../../waivioApi/ApiClient';

const WobjectShoppingList = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const getShopFeed = (userName, authUser, filter, excluded, crumb, skip, path) =>
    getWobjectShopMainFeed(authorPermlink, authUser, skip, path);

  return (
    <ShopList
      userName={authUserName}
      path={`/object/${authorPermlink}/shop`}
      getShopFeed={getShopFeed}
    />
  );
};

WobjectShoppingList.propTypes = {};

export default WobjectShoppingList;
