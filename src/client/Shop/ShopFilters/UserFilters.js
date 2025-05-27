import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import ShopFilters from './ShopFilters';
import {
  getDepartmentsUserFilters,
  showMoreTagsForUserFilters,
} from '../../../waivioApi/ApiClient';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';

const UserFilters = ({ onClose, name, isRecipePage }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const schema = getUserShopSchema(history?.location?.pathname, isRecipePage);
  const getDepartmentsFilters = path =>
    getDepartmentsUserFilters(name || match.params.name, path, schema);
  const showMoreTagsForFilters = (tagCategory, path, skip, limit) =>
    showMoreTagsForUserFilters(name || match.params.name, schema, path, tagCategory, skip, limit);

  return (
    <React.Fragment>
      <ShopFilters
        getDepartmentsFilters={getDepartmentsFilters}
        onClose={onClose}
        showMoreTagsForFilters={showMoreTagsForFilters}
      />
    </React.Fragment>
  );
};

UserFilters.propTypes = {
  onClose: PropTypes.func,
  name: PropTypes.string,
  isRecipePage: PropTypes.bool,
};

export default UserFilters;
