import React from 'react';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';

import { getWobjectDepartmentsFeed } from '../../../waivioApi/ApiClient';
import ListSwitcher from '../../Shop/ListSwitch/ListSwitcher';

const ObjectDepartmentsWobjList = ({ permlink }) => {
  const match = useRouteMatch();

  const getDepartmentsFeed = (
    authorPermlink,
    user,
    authUser,
    department,
    filters,
    path,
    skip,
    limit,
  ) => getWobjectDepartmentsFeed(authorPermlink, department, authUser, filters, path, skip, limit);

  return (
    <ListSwitcher
      user={permlink || match.params.name}
      getDepartmentsFeed={getDepartmentsFeed}
      path={permlink ? '/' : `/object/${match.params.name}/shop`}
      type={'wobject'}
    />
  );
};

ObjectDepartmentsWobjList.propTypes = {
  permlink: PropTypes.string,
};

export default ObjectDepartmentsWobjList;
