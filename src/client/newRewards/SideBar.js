import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SettingsItem from '../components/Navigation/SettingsSidenav/SettingsItem';
import {
  campaingSettings,
  matchBotsSettings,
  rewardsSettings,
} from './constants/rewardsSideNavConfig';
import { getIsAuthenticated } from '../../store/authStore/authSelectors';

const SideBar = () => {
  const isAuth = useSelector(getIsAuthenticated);
  const [menuCondition, setMenuCondition] = useState({
    rewards: true,
    campaing: true,
    matchbots: true,
  });

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <ul className="Sidenav">
      <SettingsItem
        condition={menuCondition.rewards}
        configItem={rewardsSettings}
        toggleMenuCondition={toggleMenuCondition}
      />
      {isAuth && (
        <SettingsItem
          condition={menuCondition.campaing}
          configItem={campaingSettings}
          toggleMenuCondition={toggleMenuCondition}
        />
      )}
      {isAuth && (
        <SettingsItem
          condition={menuCondition.matchbots}
          configItem={matchBotsSettings}
          toggleMenuCondition={toggleMenuCondition}
        />
      )}
    </ul>
  );
};

SideBar.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
};

export default SideBar;
