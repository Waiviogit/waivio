import React from 'react';
import PropTypes from 'prop-types';

import { getShopDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from './ShopDepartmentsList';

const GlobalShopDepartments = ({ onClose }) => (
  <ShopDepartmentsList getShopDepartments={getShopDepartments} onClose={onClose} path={`/shop`} />
);

GlobalShopDepartments.propTypes = {
  onClose: PropTypes.func,
};

export default GlobalShopDepartments;
