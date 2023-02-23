import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Modal } from 'antd';
import PropTypes from 'prop-types';

import { getShopUserDepartments } from '../../../waivioApi/ApiClient';

import './DepartmentsUser.less';

const DepartmentsUser = ({ visible, onClose }) => {
  const [department, setDepartment] = useState([]);
  const match = useRouteMatch();

  useEffect(() => {
    getShopUserDepartments(match.params.name).then(res => {
      setDepartment(res.result);
    });
  }, []);

  const body = (
    <div className="DepartmentsUser">
      <NavLink
        isActive={() => `/@${match.params.name}/shop` === match?.url}
        to={`/@${match.params.name}/shop`}
        activeClassName="DepartmentsUser__item--active"
        onClick={() => {
          if (onClose) onClose();
        }}
      >
        Departments
      </NavLink>
      <div className="DepartmentsUser__list">
        {department?.map(dep => {
          const path = `/@${match.params.name}/shop/${dep.name}`;

          return (
            <div
              key={dep.name}
              onClick={() => {
                if (onClose) onClose();
              }}
            >
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

  return visible ? (
    <Modal visible={visible} footer={null} onCancel={onClose} onOk={onClose}>
      {body}
    </Modal>
  ) : (
    body
  );
};

DepartmentsUser.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DepartmentsUser;
