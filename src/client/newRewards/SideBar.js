import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SettingsItem from '../components/Navigation/SettingsSidenav/SettingsItem';
import {
  campaingSettings,
  matchBotsSettings,
  rewardsSettings,
} from './constants/rewardsSideNavConfig';
import { getAuthenticatedUserName, getIsAuthenticated } from '../../store/authStore/authSelectors';
import ModalSignIn from '../components/Navigation/ModlaSignIn/ModalSignIn';
import { checkPayblesWarning } from '../../waivioApi/ApiClient';

const SideBar = () => {
  const isAuth = useSelector(getIsAuthenticated);
  const authUserName = useSelector(getAuthenticatedUserName);
  const [menuCondition, setMenuCondition] = useState({
    rewards: true,
    campaing: true,
    matchbots: true,
  });
  const [withWarning, setWithWarning] = useState(false);

  useEffect(() => {
    checkPayblesWarning(authUserName).then(res => {
      setWithWarning(res.warning);
    });
  }, []);

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
          configItem={campaingSettings(withWarning)}
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
      {!isAuth && (
        <span>
          For more options please <ModalSignIn isButton={false} />
        </span>
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
