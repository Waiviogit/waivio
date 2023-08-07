import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import ShopList from './ShopList';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getGlobalShopList } from '../../../store/shopStore/shopActions';

const GlobalShopingList = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
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
      getGlobalShopList(
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

  return <ShopList userName={authUserName} path={match.url} getShopFeed={getShopFeed} />;
};

export default GlobalShopingList;
