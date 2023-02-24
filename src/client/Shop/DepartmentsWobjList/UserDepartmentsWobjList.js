import React from 'react';
import { useRouteMatch } from 'react-router';
import DepartmentsWobjList from './DepartmentsWobjList';
import { getDepartmentsFeed } from '../../../waivioApi/ApiClient';

const UserDepartmentsWobjList = () => {
  const match = useRouteMatch();

  return <DepartmentsWobjList user={match.params.name} getDepartmentsFeed={getDepartmentsFeed} />;
};

export default UserDepartmentsWobjList;
