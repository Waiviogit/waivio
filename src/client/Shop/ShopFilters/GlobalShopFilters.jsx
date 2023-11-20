import React from 'react';
import PropTypes from 'prop-types';

import ShopFilters from './ShopFilters';
import { getDepartmentsFilters, showMoreTagsForShopFilters } from '../../../waivioApi/ApiClient';

const GlobalShopFilters = ({ onClose }) => (
  <ShopFilters
    getDepartmentsFilters={getDepartmentsFilters}
    onClose={onClose}
    showMoreTagsForFilters={showMoreTagsForShopFilters}
  />
);

GlobalShopFilters.propTypes = {
  onClose: PropTypes.func,
};

export default GlobalShopFilters;
