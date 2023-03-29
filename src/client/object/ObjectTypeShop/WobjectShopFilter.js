import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import {
  getMoreTagsForWobjectShopFilters,
  getWobjectShopFilters,
} from '../../../waivioApi/ApiClient';
import ShopFilters from '../../Shop/ShopFilters/ShopFilters';

const WobjectShopFilter = ({ onClose }) => {
  const match = useRouteMatch();
  const getDepartmentsFilters = path => getWobjectShopFilters(match.params.name, path);
  const showMoreTagsForFilters = (tagCategory, path, skip, limit) =>
    getMoreTagsForWobjectShopFilters(match.params.name, path, tagCategory, skip, limit);

  return (
    <ShopFilters
      getDepartmentsFilters={getDepartmentsFilters}
      onClose={onClose}
      showMoreTagsForFilters={showMoreTagsForFilters}
    />
  );
};

WobjectShopFilter.propTypes = {
  onClose: PropTypes.func,
};

export default WobjectShopFilter;
