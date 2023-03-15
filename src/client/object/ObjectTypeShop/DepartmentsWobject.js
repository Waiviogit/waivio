import React from 'react';
import PropTypes from 'prop-types';
import { getWobjectShopDepartments } from '../../../waivioApi/ApiClient';
import ShopDepartmentsList from '../../Shop/ShopDepartments/ShopDepartmentsList';

const DepartmentsWobject = ({ shopFilter, authorPermlink, visible, onClose }) => {
  const getShopDepartments = (department, excluded) =>
    getWobjectShopDepartments(authorPermlink, department, excluded);

  return (
    <ShopDepartmentsList
      shopFilter={shopFilter}
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      visible={visible}
      path={`/object/${authorPermlink}/shop`}
    />
  );
};

DepartmentsWobject.propTypes = {
  authorPermlink: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  shopFilter: PropTypes.shape(),
};

export default DepartmentsWobject;
