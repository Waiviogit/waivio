import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

import { getShopDepartments } from '../../../waivioApi/ApiClient';
import DepartmentItem from './DepartmentItem';

import './ShopDepartments.less';

const ShopDepartmentsList = ({ visible, onClose }) => {
  const match = useRouteMatch();
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getShopDepartments().then(res => setDepartments(res));
  }, []);

  const excludedMain = departments.map(d => d.name);
  const renderDep = match.params.department
    ? departments.filter(d => d.name === match.params.department)
    : departments;

  const body = (
    <div className="ShopDepartmentsList">
      <NavLink
        isActive={() => match?.url === `/shop`}
        to={`/shop`}
        activeClassName="ShopDepartmentsList__item--active"
        className="ShopDepartmentsList__depName--open"
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
  onClose: PropTypes.func,
};

export default ShopDepartmentsList;
