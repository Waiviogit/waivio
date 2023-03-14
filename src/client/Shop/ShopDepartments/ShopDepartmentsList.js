import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import DepartmentItem from './DepartmentItem';

import './ShopDepartments.less';

const ShopDepartmentsList = ({ shopFilter, visible, onClose, getShopDepartments, path }) => {
  const match = useRouteMatch();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getShopDepartments().then(res => {
      setDepartments(res);
    });
  }, [shopFilter]);

  const excludedMain = departments.map(d => d.name);

  const renderDep = match.params.department
    ? departments.filter(d => d.name === match.params.department)
    : departments;

  const body = !isEmpty(departments) && (
    <div className="ShopDepartmentsList">
      <NavLink
        isActive={() => match?.url === path}
        to={path}
        activeClassName="ShopDepartmentsList__item--active"
        className="ShopDepartmentsList__maindepName"
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
          />
        ))}
      </div>
    </div>
  );

  return visible ? (
    <Modal visible={visible} footer={null} onCancel={onClose} onOk={onClose}>
      {body}
    </Modal>
  ) : (
    body
  );
};

ShopDepartmentsList.propTypes = {
  visible: PropTypes.bool,
  path: PropTypes.string,
  onClose: PropTypes.func,
  getShopDepartments: PropTypes.func,
  shopFilter: PropTypes.shape(),
};

export default ShopDepartmentsList;
