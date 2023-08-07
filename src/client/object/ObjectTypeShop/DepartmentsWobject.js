import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { useDispatch } from 'react-redux';

import ShopDepartmentsList from '../../Shop/ShopDepartments/ShopDepartmentsList';
import { getWobjectDepartments } from '../../../store/shopStore/shopActions';

const DepartmentsWobject = ({ shopFilter, onClose }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const getShopDepartments = (department, excluded, path, notWrite) =>
    dispatch(getWobjectDepartments(match.params.name, department, excluded, path, notWrite));

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
