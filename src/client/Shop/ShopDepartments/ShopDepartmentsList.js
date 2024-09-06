import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import DepartmentItem from './DepartmentItem';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';

import './ShopDepartments.less';
import { getDepartmentsList } from '../../../store/shopStore/shopSelectors';

const ShopDepartmentsList = ({ shopFilter, schema, onClose, getShopDepartments, path, intl }) => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const departments = useSelector(getDepartmentsList);
  const isRecipe = schema === 'recipe';

  useEffect(() => {
    getShopDepartments();
  }, [match.params.name, shopFilter, schema]);

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
          {intl.formatMessage({
            id: `${isRecipe ? 'categories' : 'departments'}`,
            defaultMessage: `${isRecipe ? 'Categories' : 'Departments'}`,
          })}
        </NavLink>
        <div>
          {renderDep?.map(dep => (
            <DepartmentItem
              key={dep.name}
              match={match}
              department={dep}
              excludedMain={excludedMain}
              onClose={onClose}
              getShopDepartments={getShopDepartments}
              path={path}
              pathList={[]}
            />
          ))}
        </div>
      </div>
    )
  );
};

ShopDepartmentsList.propTypes = {
  path: PropTypes.string,
  schema: PropTypes.string,
  onClose: PropTypes.func,
  getShopDepartments: PropTypes.func,
  shopFilter: PropTypes.shape(),
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

export default injectIntl(ShopDepartmentsList);
