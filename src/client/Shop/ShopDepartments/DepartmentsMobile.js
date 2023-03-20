import React from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';

import './ShopDepartments.less';

const DepartmentsMobile = ({ setVisible }) => {
  const match = useRouteMatch();
  const location = useLocation();

  return (
    <div className="ShopDepartmentsList__mobile" onClick={setVisible}>
      Departments{' '}
      {match.params.department && (
        <span>
          <Icon type="right" /> {getLastPermlinksFromHash(location.hash) || match.params.department}
        </span>
      )}
    </div>
  );
};

DepartmentsMobile.propTypes = {
  setVisible: PropTypes.func,
};

export default DepartmentsMobile;