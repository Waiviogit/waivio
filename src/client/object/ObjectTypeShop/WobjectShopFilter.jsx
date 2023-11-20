import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import {
  getMoreTagsForWobjectShopFilters,
  getWobjectShopFilters,
} from '../../../waivioApi/ApiClient';
import ShopFilters from '../../Shop/ShopFilters/ShopFilters';

const WobjectShopFilter = ({ onClose, name }) => {
  const match = useRouteMatch();
  const wobjName = name || match.params.name;
  const getDepartmentsFilters = path => getWobjectShopFilters(wobjName, path);
  const showMoreTagsForFilters = (tagCategory, path, skip, limit) =>
    getMoreTagsForWobjectShopFilters(wobjName, path, tagCategory, skip, limit);

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
  name: PropTypes.string,
};

export default WobjectShopFilter;
