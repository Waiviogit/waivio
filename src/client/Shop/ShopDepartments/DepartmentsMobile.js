import React from 'react';
import { useLocation, useRouteMatch } from 'react-router';
import { Icon, Modal } from 'antd';
import PropTypes from 'prop-types';

import { getLastPermlinksFromHash } from '../../../common/helpers/wObjectHelper';
import GlobalShopDepartments from './GlobalShopDepartments';
import DepartmentsWobject from '../../object/ObjectTypeShop/DepartmentsWobject';
import DepartmentsUser from './DepartmentsUser';

import './ShopDepartments.less';

const DepartmentsMobile = ({ type, setVisible, visible, isSocial, name }) => {
  const match = useRouteMatch();
  const location = useLocation();

  const modalBody = () => {
    switch (type) {
      case 'user':
        return (
          <DepartmentsUser isSocial={isSocial} name={name} onClose={() => setVisible(false)} />
        );
      case 'wobject':
        return (
          <DepartmentsWobject isSocial={isSocial} name={name} onClose={() => setVisible(false)} />
        );

      default:
        return <GlobalShopDepartments isSocial={isSocial} onClose={() => setVisible(false)} />;
    }
  };

  return (
    <React.Fragment>
      <div className="ShopDepartmentsList__mobileCrumbs" onClick={() => setVisible(true)}>
        <b>Departments</b> (<span className="ShopDepartmentsList__select">Select</span>)
        {match.params.department && (
          <span>
            <Icon type="right" />{' '}
            {getLastPermlinksFromHash(location.hash) || match.params.department}
          </span>
        )}
      </div>
      <Modal onCancel={() => setVisible(false)} visible={visible} footer={null}>
        {modalBody()}
      </Modal>
    </React.Fragment>
  );
};

DepartmentsMobile.propTypes = {
  setVisible: PropTypes.func,
  type: PropTypes.string,
  name: PropTypes.string,
  visible: PropTypes.bool,
  isSocial: PropTypes.bool,
};

export default DepartmentsMobile;
