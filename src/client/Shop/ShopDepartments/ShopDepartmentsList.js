import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useHistory, useRouteMatch } from 'react-router';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import DepartmentItem from './DepartmentItem';
import { resetBreadCrumb } from '../../../store/shopStore/shopActions';
import { getPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

import './ShopDepartments.less';

const ShopDepartmentsList = ({ visible, onClose, getShopDepartments, path }) => {
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
  }, [match.params.name]);

  if (isEmpty(departments)) return null;

  const excludedMain = isEmpty(departments) ? [] : departments?.map(d => d.name);

  const renderDep = match.params.department
    ? departments?.filter(d => d.name === match.params.department)
    : departments;

  const body = !isEmpty(departments) && (
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
};

export default ShopDepartmentsList;
