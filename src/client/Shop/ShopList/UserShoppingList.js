import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ShopList from './ShopList';
import { getUserShopMainFeed } from '../../../waivioApi/ApiClient';

const UserShoppingList = ({ user, isSocial }) => {
  const match = useRouteMatch();

  return (
    <ShopList
      userName={user || match.params.name}
      path={user ? '/' : match.url}
      getShopFeed={getUserShopMainFeed}
      isSocial={isSocial}
    />
  );
};

UserShoppingList.propTypes = {
  user: PropTypes.string,
  isSocial: PropTypes.bool,
};

export default UserShoppingList;
