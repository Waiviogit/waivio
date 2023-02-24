import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import { getShopDepartments } from '../../../waivioApi/ApiClient';
import DepartmentItem from './DepartmentItem';

import './ShopDepartments.less';

const ShopDepartmentsList = () => {
  const match = useRouteMatch();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getShopDepartments().then(res => setDepartments(res));
  }, []);

  return (
    <div className="ShopDepartmentsList">
      <NavLink
        isActive={() => match?.url === `/shop`}
        to={`/shop`}
        activeClassName="ShopDepartmentsList__item--active"
      >
        Departments
      </NavLink>
      <div>
        {departments.map(dep => (
          <DepartmentItem key={dep.name} match={match} department={dep} />
        ))}
      </div>
    </div>
  );
};

export default ShopDepartmentsList;
