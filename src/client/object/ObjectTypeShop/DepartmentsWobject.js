import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';

import { getWobjectShopDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from '../../Shop/ShopDepartments/ShopDepartmentsList';

const DepartmentsWobject = ({ shopFilter, onClose }) => {
  const match = useRouteMatch();
  const getShopDepartments = (department, excluded, path) =>
    getWobjectShopDepartments(match.params.name, department, excluded, path);

  return (
    <ShopDepartmentsList
      shopFilter={shopFilter}
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={
        match.url.includes('object-shop')
          ? `/object-shop/${match.params.name}`
          : `/object/${match.params.name}/shop`
      }
    />
  );
};

DepartmentsWobject.propTypes = {
  onClose: PropTypes.func,
  shopFilter: PropTypes.shape(),
};

export default DepartmentsWobject;
