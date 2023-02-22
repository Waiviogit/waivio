import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';

import { getShopUserDepartments } from '../../../waivioApi/ApiClient';

import './DepartmentsUser.less';
import useQuery from '../../../hooks/useQuery';
import { parseQuery } from '../../../waivioApi/helpers';

const DepartmentsUser = () => {
  const [department, setDepartment] = useState([]);
  const match = useRouteMatch();

  const query = useQuery();

  const parseQueryForFilters = () => {
    const parsedQuery = parseQuery(query.toString());

    return Object.keys(parsedQuery).reduce(
      (acc, curr) => {
        if (curr === 'rating') return { ...acc, rating: +parsedQuery.rating };

        return {
          ...acc,
          tagCategory: [
            ...acc.tagCategory,
            {
              categoryName: curr,
              tags: parsedQuery[curr],
            },
          ],
        };
      },
      { tagCategory: [] },
    );
  };

  useEffect(() => {
    getShopUserDepartments(match.params.name, parseQueryForFilters()).then(res => {
      setDepartment(res.result);
    });
  }, [query.toString()]);

  return (
    <div className="DepartmentsUser">
      <NavLink
        isActive={() => `/@${match.params.name}/shop` === match?.url}
        to={`/@${match.params.name}/shop`}
        activeClassName="DepartmentsUser__item--active"
      >
        Departments
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
