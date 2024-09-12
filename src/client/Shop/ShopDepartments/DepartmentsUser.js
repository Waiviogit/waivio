import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import ShopDepartmentsList from './ShopDepartmentsList';
import { getUserDepartments } from '../../../store/shopStore/shopActions';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';

const DepartmentsUser = ({ onClose, isSocial, name }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const schema = getUserShopSchema(history?.location?.pathname);
  const isRecipe =
    history?.location?.pathname?.includes('@') && history?.location?.pathname?.includes('recipe');
  const waivioPath = isRecipe ? `/@${match.params.name}/recipe` : `/@${match.params.name}/userShop`;
  const getShopDepartments = (department, excluded, path) =>
    dispatch(getUserDepartments(name || match.params.name, schema, department, excluded, path));

  return (
    <ShopDepartmentsList
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      schema={schema}
      path={isSocial ? `/user-shop/${name || match.params.name}` : waivioPath}
    />
  );
};

DepartmentsUser.propTypes = {
  onClose: PropTypes.func,
  isSocial: PropTypes.bool,
  name: PropTypes.string,
};

export default DepartmentsUser;
