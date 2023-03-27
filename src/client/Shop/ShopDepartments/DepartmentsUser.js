import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getShopUserDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from './ShopDepartmentsList';

const DepartmentsUser = ({ onClose }) => {
  const match = useRouteMatch();
  const getShopDepartments = (department, excluded, path) =>
    getShopUserDepartments(match.params.name, department, excluded, path);

  return (
    <ShopDepartmentsList
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={`/@${match.params.name}/userShop`}
    />
  );
};

DepartmentsUser.propTypes = {
  onClose: PropTypes.func,
};

export default DepartmentsUser;
