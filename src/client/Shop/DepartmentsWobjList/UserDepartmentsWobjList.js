import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router';
import { getUserShopList } from '../../../store/shopStore/shopActions';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ListSwitcher from '../ListSwitch/ListSwitcher';
import { getUserShopSchema } from '../../../common/helpers/shopHelper';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const UserDepartmentsWobjList = ({ isSocial }) => {
  const match = useRouteMatch();
  const authUserName = useSelector(getAuthenticatedUserName);
  const name = match.params.name || authUserName;
  const history = useHistory();
  const isRecipe = getUserShopSchema(history?.location?.pathname) === 'recipe';
  const socialPath = isRecipe ? `/recipe/${name}` : `/user-shop/${name}`;
  const waivioPath = isRecipe ? `/@${name}/recipe` : `/@${name}/userShop`;

  return (
    <ListSwitcher
      user={name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={isSocial ? socialPath : waivioPath}
      type={'user'}
      isSocial={isSocial}
    />
  );
};

UserDepartmentsWobjList.propTypes = {
  isSocial: PropTypes.bool,
};

UserDepartmentsWobjList.fetchData = ({ store, match, url }) => {
  const schema = getUserShopSchema(url);

  return store.dispatch(
    getUserShopList(
      match.params.name,
      schema,
      match.params.name,
      { tagCategory: [] },
      [],
      match.params.department,
      0,
      [],
    ),
  );
};
export default UserDepartmentsWobjList;
