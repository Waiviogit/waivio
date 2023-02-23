import React from 'react';
import { useRouteMatch } from 'react-router';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import './DepartmentsUser.less';

const DepartmentsMobile = ({ setVisible }) => {
  const match = useRouteMatch();

  return (
    <div className="DepartmentsUser__mobile" onClick={setVisible}>
      Departments{' '}
      {match.params.departments && (
        <span>
          <Icon type="right" /> {match.params.departments}
        </span>
      )}
    </div>
  );
};

DepartmentsMobile.propTypes = {
  setVisible: PropTypes.func,
};

export default DepartmentsMobile;
