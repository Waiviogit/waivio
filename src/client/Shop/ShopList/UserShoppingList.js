import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ShopList from './ShopList';
import { getUserShopList } from '../../../store/shopStore/shopActions';

const UserShoppingList = ({ isSocial }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const getShopFeed = (
    userName,
    follower,
    filter,
    excludedDepartments,
    department,
    skip,
    path,
    limit,
    categoryLimit,
    isLoadMore,
  ) =>
    dispatch(
      getUserShopList(
        userName,
        follower,
        filter,
        excludedDepartments,
        department,
        skip,
        path,
        limit,
        categoryLimit,
        isLoadMore,
      ),
    );

  return (
    <ShopList
      userName={match.params.name}
      path={isSocial ? `/user-shop/${match.params.name}` : match.url}
      getShopFeed={getShopFeed}
      isSocial={isSocial}
    />
  );
};

UserShoppingList.propTypes = {
  isSocial: PropTypes.bool,
};

export default UserShoppingList;
