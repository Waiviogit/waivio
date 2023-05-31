import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getShopUserDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from './ShopDepartmentsList';

const DepartmentsUser = ({ onClose, userName }) => {
  const match = useRouteMatch();
  const getShopDepartments = (department, excluded, path) =>
    getShopUserDepartments(userName || match.params.name, department, excluded, path);

  return (
    <ShopDepartmentsList
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={userName ? '' : `/@${match.params.name}/userShop`}
    />
  );
};

DepartmentsUser.propTypes = {
  onClose: PropTypes.func,
  userName: PropTypes.string,
};

export default DepartmentsUser;
