import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { getUserShopList } from '../../../store/shopStore/shopActions';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const UserDepartmentsWobjList = ({ isSocial }) => {
  const match = useRouteMatch();

  return (
    <ListSwitcher
      user={match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={isSocial ? `/user-shop/${match.params.name}` : `/@${match.params.name}/userShop`}
      type={'user'}
      isSocial={isSocial}
    />
  );
};

UserDepartmentsWobjList.propTypes = {
  isSocial: PropTypes.bool,
};

UserDepartmentsWobjList.fetchData = ({ store, match }) =>
  store.dispatch(
    getUserShopList(
      match.params.name,
      match.params.name,
      { tagCategory: [] },
      [],
      match.params.department,
      0,
      [],
    ),
  );

export default UserDepartmentsWobjList;
