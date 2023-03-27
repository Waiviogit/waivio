import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import DepartmentItem from './DepartmentItem';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import { getPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

import './ShopDepartments.less';

const ShopDepartmentsList = ({ shopFilter, onClose, getShopDepartments, path }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const [departments, setDepartments] = useState([]);
  const pathList = match.params.department
    ? [match.params.department, ...getPermlinksFromHash(history.location.hash)]
    : undefined;

  useEffect(() => {
    getShopDepartments().then(res => {
      setDepartments(res);
    });
  }, [match.params.name, shopFilter]);

  if (isEmpty(departments)) return null;

  const excludedMain = isEmpty(departments) ? [] : departments?.map(d => d.name);

  const renderDep = match.params.department
    ? departments?.filter(d => d.name === match.params.department)
    : departments;

  return (
    !isEmpty(departments) && (
      <div className="ShopDepartmentsList">
        <NavLink
          isActive={() => match?.url === path}
          to={path}
          activeClassName="ShopDepartmentsList__item--active"
          className="ShopDepartmentsList__maindepName"
          onClick={() => dispatch(resetBreadCrumb())}
        >
          Departments
        </NavLink>
        <div>
          {renderDep.map(dep => (
            <DepartmentItem
              key={dep.name}
              match={match}
              department={dep}
              excludedMain={excludedMain}
              onClose={onClose}
              getShopDepartments={getShopDepartments}
              path={path}
              pathList={pathList}
            />
          ))}
        </div>
      </div>
    )
  );
};

ShopDepartmentsList.propTypes = {
  path: PropTypes.string,
  onClose: PropTypes.func,
  getShopDepartments: PropTypes.func,
  shopFilter: PropTypes.shape(),
};

export default ShopDepartmentsList;
