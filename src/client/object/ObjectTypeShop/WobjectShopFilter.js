import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import {
  getMoreTagsForWobjectShopFilters,
  getWobjectShopFilters,
} from '../../../waivioApi/ApiClient';
import ShopFilters from '../../Shop/ShopFilters/ShopFilters';

const WobjectShopFilter = ({ visible, onClose }) => {
  const match = useRouteMatch();
  const getDepartmentsFilters = path => getWobjectShopFilters(match.params.name, path);
  const showMoreTagsForFilters = (path, tagCategory, objType, skip, limit) =>
    getMoreTagsForWobjectShopFilters(match.params.name, path, tagCategory, skip, limit);

  return (
    <ShopFilters
      getDepartmentsFilters={getDepartmentsFilters}
      visible={visible}
      onClose={onClose}
      showMoreTagsForFilters={showMoreTagsForFilters}
    />
  );
};

WobjectShopFilter.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default WobjectShopFilter;
