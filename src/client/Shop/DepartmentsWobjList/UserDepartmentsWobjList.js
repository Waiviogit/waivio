import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const UserDepartmentsWobjList = ({ userName }) => {
  const match = useRouteMatch();

  return (
    <ListSwitcher
      user={userName || match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={userName ? '/' : `/@${match.params.name}/userShop`}
      type={'user'}
    />
  );
};

UserDepartmentsWobjList.propTypes = {
  userName: PropTypes.string,
};

export default UserDepartmentsWobjList;
