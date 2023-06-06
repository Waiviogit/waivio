import React from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ShopList from '../../Shop/ShopList/ShopList';
import { getWobjectShopMainFeed } from '../../../waivioApi/ApiClient';

const WobjectShoppingList = ({ isSocial }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const authorPermlink = match.params.name;
  const getShopFeed = (userName, authUser, filter, excluded, department, skip, path) =>
    getWobjectShopMainFeed(authorPermlink, department, authUser, skip, excluded, filter, path);

  return (
    <ShopList
      userName={authUserName}
      path={
        match.url.includes('object-shop')
          ? `/object-shop/${authorPermlink}`
          : `/object/${authorPermlink}/shop`
      }
      getShopFeed={getShopFeed}
      isSocial={isSocial}
    />
  );
};

WobjectShoppingList.propTypes = {
  isSocial: PropTypes.bool,
};

export default WobjectShoppingList;
