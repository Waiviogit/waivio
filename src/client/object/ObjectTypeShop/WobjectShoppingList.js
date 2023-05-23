import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ShopList from '../../Shop/ShopList/ShopList';
import { getWobjectShopMainFeed } from '../../../waivioApi/ApiClient';

const WobjectShoppingList = ({ permlink }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const authorPermlink = permlink || match.params.name;
  const getShopFeed = (userName, authUser, filter, excluded, department, skip, path) =>
    getWobjectShopMainFeed(authorPermlink, department, authUser, skip, excluded, filter, path);

  return (
    <ShopList
      userName={authUserName}
      path={permlink ? '/' : `/object/${authorPermlink}/shop`}
      getShopFeed={getShopFeed}
    />
  );
};

WobjectShoppingList.propTypes = {
  permlink: PropTypes.string,
};

export default WobjectShoppingList;
