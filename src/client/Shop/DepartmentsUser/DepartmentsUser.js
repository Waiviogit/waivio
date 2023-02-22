import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';

import { getShopUserDepartments } from '../../../waivioApi/ApiClient';

import './DepartmentsUser.less';

const DepartmentsUser = () => {
  const [department, setDepartment] = useState([]);
  const match = useRouteMatch();

  useEffect(() => {
    getShopUserDepartments(match.params.name, 0, 10).then(res => {
      setDepartment(res.result);
    });
  }, []);

  return (
    <div className="DepartmentsUser">
      <NavLink
        isActive={() => `/@${match.params.name}/shop` === match?.url}
        to={`/@${match.params.name}/shop`}
        activeClassName="DepartmentsUser__item--active"
      >
        Departmens
      </NavLink>
      <div className="DepartmentsUser__list">
        {department?.map(dep => {
          const path = `/@${match.params.name}/shop/${dep.name}`;

          return (
            <div key={dep.name}>
              <NavLink
                to={path}
                isActive={() => path === match?.url}
                activeClassName="DepartmentsUser__item--active"
              >
                {dep.name}
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentsUser;
