import React from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ShopDepartmentsList from './ShopDepartmentsList';
import { getUserDepartments } from '../../../store/shopStore/shopActions';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const DepartmentsUser = ({ onClose, isSocial, name, isRecipePage }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const authUserName = useSelector(getAuthenticatedUserName);
  const userName = name || match.params.name || authUserName;
  const schema = getUserShopSchema(history?.location?.pathname, isRecipePage);
  const recipePath = getUserShopSchema(history?.location?.pathname) === 'recipe';
  const isRecipe = recipePath || isRecipePage;
  const socialPath = isRecipe ? `/recipe/${userName}` : `/user-shop/${userName}`;
  const waivioPath = isRecipe ? `/@${userName}/recipe` : `/@${userName}/userShop`;
  const getShopDepartments = (department, excluded, path) =>
    dispatch(getUserDepartments(userName, schema, department, excluded, path));

  return (
    <ShopDepartmentsList
      getShopDepartments={getShopDepartments}
      onClose={onClose}
      schema={schema}
      path={isSocial ? socialPath : waivioPath}
    />
  );
};

DepartmentsUser.propTypes = {
  onClose: PropTypes.func,
  isSocial: PropTypes.bool,
  isRecipePage: PropTypes.bool,
  name: PropTypes.string,
};

export default DepartmentsUser;
