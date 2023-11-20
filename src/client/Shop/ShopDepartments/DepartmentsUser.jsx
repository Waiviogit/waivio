import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ShopDepartmentsList from './ShopDepartmentsList';
import { getUserDepartments } from '../../../store/shopStore/shopActions';

const DepartmentsUser = ({ onClose, isSocial, name }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const getShopDepartments = (department, excluded, path) =>
    dispatch(getUserDepartments(name || match.params.name, department, excluded, path));

  return (
    <ShopDepartmentsList
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={
        isSocial ? `/user-shop/${name || match.params.name}` : `/@${match.params.name}/userShop`
      }
    />
  );
};

DepartmentsUser.propTypes = {
  onClose: PropTypes.func,
  isSocial: PropTypes.bool,
  name: PropTypes.string,
};

export default DepartmentsUser;
