import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ShopList from './ShopList';
import { getUserShopMainFeed } from '../../../waivioApi/ApiClient';

const UserShoppingList = ({ user }) => {
  const match = useRouteMatch();

  return (
    <ShopList
      userName={user || match.params.name}
      path={user ? '/' : match.url}
      getShopFeed={getUserShopMainFeed}
    />
  );
};

UserShoppingList.propTypes = {
  user: PropTypes.string,
};

export default UserShoppingList;
