import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ShopFilters from './ShopFilters';
import {
  getDepartmentsUserFilters,
  showMoreTagsForUserFilters,
} from '../../../waivioApi/ApiClient';

const UserFilters = ({ onClose }) => {
  const match = useRouteMatch();
  const getDepartmentsFilters = path => getDepartmentsUserFilters(match.params.name, path);
  const showMoreTagsForFilters = (tagCategory, path, skip, limit) =>
    showMoreTagsForUserFilters(match.params.name, path, tagCategory, skip, limit);

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
};

export default UserFilters;
