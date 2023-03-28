import React from 'react';
import PropTypes from 'prop-types';
import { getWobjectShopDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from '../../Shop/ShopDepartments/ShopDepartmentsList';

const DepartmentsWobject = ({ shopFilter, authorPermlink, onClose }) => {
  const getShopDepartments = (department, excluded, path) =>
    getWobjectShopDepartments(authorPermlink, department, excluded, path);

  return (
    <ShopDepartmentsList
      shopFilter={shopFilter}
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={`/object/${authorPermlink}/shop`}
    />
  );
};

DepartmentsWobject.propTypes = {
  authorPermlink: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  shopFilter: PropTypes.shape(),
};

export default DepartmentsWobject;
