import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { adminSettings } from '../SettingsSidenav/constants';
import '../Sidenav.less';
import SettingsItem from '../SettingsSidenav/SettingsItem';

const AdminSidenav = () => {
  const [menuCondition, setMenuCondition] = useState({
    admin: true,
  });

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <ul className="Sidenav SettingsSidenav">
      <SettingsItem
        condition={menuCondition.admin}
        configItem={adminSettings}
        toggleMenuCondition={toggleMenuCondition}
      />
    </ul>
  );
};

AdminSidenav.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
};

export default AdminSidenav;
