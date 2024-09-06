import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ShopList from './ShopList';
import { getUserShopList } from '../../../store/shopStore/shopActions';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';

const UserShoppingList = ({ isSocial, name }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const schema = getUserShopSchema(history?.location?.pathname);
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
        schema,
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
      userName={name || match.params.name}
      path={isSocial ? `/user-shop/${name || match.params.name}` : match.url}
      getShopFeed={getShopFeed}
      isSocial={isSocial}
    />
  );
};

UserShoppingList.propTypes = {
  isSocial: PropTypes.bool,
  name: PropTypes.string,
};

export default UserShoppingList;
