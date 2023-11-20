import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ShopFilters from './ShopFilters';
import {
  getDepartmentsUserFilters,
  showMoreTagsForUserFilters,
} from '../../../waivioApi/ApiClient';

const UserFilters = ({ onClose, name }) => {
  const match = useRouteMatch();
  const getDepartmentsFilters = path => getDepartmentsUserFilters(name || match.params.name, path);
  const showMoreTagsForFilters = (tagCategory, path, skip, limit) =>
    showMoreTagsForUserFilters(name || match.params.name, path, tagCategory, skip, limit);

  return (
    <ShopFilters
      getDepartmentsFilters={getDepartmentsFilters}
      onClose={onClose}
      showMoreTagsForFilters={showMoreTagsForFilters}
    />
  );
};

UserFilters.propTypes = {
  onClose: PropTypes.func,
  name: PropTypes.string,
};

export default UserFilters;
