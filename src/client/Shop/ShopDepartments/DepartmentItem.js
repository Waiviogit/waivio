import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';

import { getShopDepartments } from '../../../waivioApi/ApiClient';

import './ShopDepartments.less';

const DepartmentItem = ({ department, match, excludedMain }) => {
  const [nestedDepartments, setNestedDepartments] = useState([]);
  const [showNested, setShowNested] = useState(false);
  const history = useHistory();
  const getNestedDepartments = () => {
    history.push(department.name);
    if (isEmpty(nestedDepartments)) {
      getShopDepartments(department.name, excluded).then(res => {
        setNestedDepartments(res);
        setShowNested(!showNested);
      });
    } else {
      setShowNested(!showNested);
    }
  };

  const itemClassList = classNames('ShopDepartmentsList__item', {
    'ShopDepartmentsList__item--withNested': department.subdirectory,
  });

  const itemListClassList = classNames('ShopDepartmentsList__list', {
    'ShopDepartmentsList__list--show': showNested,
  });

  const excluded = [...excludedMain, ...nestedDepartments.map(nes => nes.name)];

  return (
    <div className={itemClassList}>
      {department.subdirectory ? (
        <div onClick={getNestedDepartments}>
          {department.name}{' '}
          <Icon style={{ fontSize: '12px' }} type={showNested ? 'down' : 'right'} />
        </div>
      ) : (
        <NavLink
          to={`/shop/${department.name}`}
          isActive={() => `/shop/${department.name}` === match?.url}
          activeClassName="ShopDepartmentsList__item--active"
        >
          {department.name}
        </NavLink>
      )}
      <div className={itemListClassList}>
        {nestedDepartments.map(nest => (
          <DepartmentItem key={nest.name} department={nest} match={match} excludedMain={excluded} />
        ))}
      </div>
    </div>
  );
};

DepartmentItem.propTypes = {
  department: PropTypes.shape({
    name: PropTypes.string,
    subdirectory: PropTypes.bool,
  }),
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
  excludedMain: PropTypes.arrayOf(PropTypes.string),
};

DepartmentItem.defaultProps = {
  excludedMain: [],
};

export default DepartmentItem;
