import React from 'react';
import PropTypes from 'prop-types';

import { getShopDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from './ShopDepartmentsList';

const GlobalShopDepartments = ({ visible, onClose }) => (
  <ShopDepartmentsList
    getShopDepartments={getShopDepartments}
    onClose={onClose}
    visible={visible}
    path={`/shop`}
  />
);

GlobalShopDepartments.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default GlobalShopDepartments;
