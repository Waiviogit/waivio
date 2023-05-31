import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ListSwitcher from '../ListSwitch/ListSwitcher';

const UserDepartmentsWobjList = ({ userName, isSocial }) => {
  const match = useRouteMatch();

  return (
    <ListSwitcher
      user={userName || match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={userName ? '' : `/@${match.params.name}/userShop`}
      type={'user'}
      isSocial={isSocial}
    />
  );
};

UserDepartmentsWobjList.propTypes = {
  userName: PropTypes.string,
  isSocial: PropTypes.bool,
};

export default UserDepartmentsWobjList;
