import React from 'react';
import PropTypes from 'prop-types';

import ShopFilters from './ShopFilters';
import { getDepartmentsFilters, showMoreTagsForShopFilters } from '../../../waivioApi/ApiClient';

const GlobalShopFilters = ({ visible, onClose }) => (
  <ShopFilters
    getDepartmentsFilters={getDepartmentsFilters}
    visible={visible}
    onClose={onClose}
    showMoreTagsForFilters={showMoreTagsForShopFilters}
  />
);

GlobalShopFilters.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default GlobalShopFilters;
