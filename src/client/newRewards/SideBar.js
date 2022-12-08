import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import SettingsItem from '../components/Navigation/SettingsSidenav/SettingsItem';
import {
  campaingSettings,
  matchBotsSettings,
  rewardsSettings,
  refferalsSettings,
} from './constants/rewardsSideNavConfig';
import { getAuthenticatedUserName, getIsAuthenticated } from '../../store/authStore/authSelectors';
import ModalSignIn from '../components/Navigation/ModlaSignIn/ModalSignIn';
import { checkPayblesWarning } from '../../waivioApi/ApiClient';
import { getIsWaivio } from '../../store/appStore/appSelectors';
import { guestUserRegex } from '../../common/helpers/regexHelpers';

import './SideBar.less';

const SideBar = () => {
  const isAuth = useSelector(getIsAuthenticated);
  const authUserName = useSelector(getAuthenticatedUserName);
  const isWaivio = useSelector(getIsWaivio);
  const [menuCondition, setMenuCondition] = useState({
    rewards: true,
    campaing: true,
    matchbots: true,
    refferals: true,
  });
  const [withWarning, setWithWarning] = useState(false);

  useEffect(() => {
    if (authUserName && !guestUserRegex.test(authUserName)) {
      checkPayblesWarning(authUserName).then(res => {
        setWithWarning(res.warning);
      });
    }
  }, [authUserName]);

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <ul className="Sidenav SideBar" style={{ marginTop: '20px' }}>
      <SettingsItem
        condition={menuCondition.rewards}
        configItem={rewardsSettings}
        toggleMenuCondition={toggleMenuCondition}
      />
      {isAuth && isWaivio && (
        <SettingsItem
          condition={menuCondition.campaing}
          configItem={campaingSettings(withWarning)}
          toggleMenuCondition={toggleMenuCondition}
        />
      )}
      {isAuth && isWaivio && (
        <SettingsItem
          condition={menuCondition.refferals}
          configItem={refferalsSettings}
          toggleMenuCondition={toggleMenuCondition}
        />
      )}
      {isAuth && isWaivio && (
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
