import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ShopDepartmentsList from './ShopDepartmentsList';
import { getGlobalDepartments } from '../../../store/shopStore/shopActions';

const GlobalShopDepartments = ({ onClose }) => {
  const dispatch = useDispatch();
  const getShopDepartments = (name, department, excluded, path, notWrite) =>
    dispatch(getGlobalDepartments(name, department, excluded, path, notWrite));

  return (
    <ShopDepartmentsList getShopDepartments={getShopDepartments} onClose={onClose} path={`/shop`} />
  );
};

GlobalShopDepartments.propTypes = {
  onClose: PropTypes.func,
};

export default GlobalShopDepartments;
