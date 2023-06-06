import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ShopList from './ShopList';
import { getUserShopMainFeed } from '../../../waivioApi/ApiClient';

const UserShoppingList = ({ isSocial }) => {
  const match = useRouteMatch();

  return (
    <ShopList
      userName={match.params.name}
      path={isSocial ? `/user-shop/${match.params.name}` : match.url}
      getShopFeed={getUserShopMainFeed}
      isSocial={isSocial}
    />
  );
};

UserShoppingList.propTypes = {
  isSocial: PropTypes.bool,
};

export default UserShoppingList;
