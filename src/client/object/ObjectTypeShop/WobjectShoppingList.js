import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import ShopList from '../../Shop/ShopList/ShopList';
import { getWobjectsShopList } from '../../../store/shopStore/shopActions';

const WobjectShoppingList = ({ isSocial, name }) => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const match = useRouteMatch();
  const authorPermlink = name || match.params.name;
  const dispatch = useDispatch();
  const getShopFeed = (
    userName,
    authUser,
    filter,
    excluded,
    department,
    skip,
    path,
    limit,
    categoryLimit,
    isLoadMore,
  ) =>
    dispatch(
      getWobjectsShopList(
        authorPermlink,
        department,
        authUser,
        skip,
        excluded,
        filter,
        path,
        limit,
        categoryLimit,
        isLoadMore,
      ),
    );

  return (
    <ShopList
      userName={authUserName}
      path={
        match.url?.includes('object-shop')
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
  name: PropTypes.string,
};

export default WobjectShoppingList;
