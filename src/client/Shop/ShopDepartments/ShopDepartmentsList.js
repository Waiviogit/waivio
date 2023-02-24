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

  const body = (
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
