import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router';
import { useDispatch } from 'react-redux';

import ShopDepartmentsList from '../../Shop/ShopDepartments/ShopDepartmentsList';
import { getWobjectDepartments } from '../../../store/shopStore/shopActions';

const DepartmentsWobject = ({ shopFilter, onClose, name }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const wobjName = name || match.params.name;

  const getShopDepartments = (department, excluded, path) =>
    dispatch(getWobjectDepartments(wobjName, department, excluded, path));

  return (
    <ShopDepartmentsList
      shopFilter={shopFilter}
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      path={
        match.url?.includes('object-shop')
          ? `/object-shop/${wobjName}`
          : `/object/${match.params.name}/shop`
      }
    />
  );
};

DepartmentsWobject.propTypes = {
  onClose: PropTypes.func,
  shopFilter: PropTypes.shape(),
  name: PropTypes.string,
};

export default DepartmentsWobject;
