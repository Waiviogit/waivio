import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getShopUserDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from './ShopDepartmentsList';

const DepartmentsUser = ({ onClose, isSocial }) => {
  const match = useRouteMatch();
  const getShopDepartments = (department, excluded, path) =>
    getShopUserDepartments(match.params.name, department, excluded, path);

  return (
    <ShopDepartmentsList
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={isSocial ? `/user-shop/${match.params.name}` : `/@${match.params.name}/userShop`}
    />
  );
};

DepartmentsUser.propTypes = {
  onClose: PropTypes.func,
  isSocial: PropTypes.bool,
};

export default DepartmentsUser;
