import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';

import SettingsItem from '../components/Navigation/SettingsSidenav/SettingsItem';
import {
  campaingSettings,
  matchBotsSettings,
  rewardsSettings,
  refferalsSettings,
  rewardsWithJudgesSettings,
} from './constants/rewardsSideNavConfig';
import { getAuthenticatedUserName, getIsAuthenticated } from '../../store/authStore/authSelectors';
import ModalSignIn from '../components/Navigation/ModlaSignIn/ModalSignIn';
import { checkPayblesWarning, getJudgeRewardsMain } from '../../waivioApi/ApiClient';
import { getIsWaivio } from '../../store/appStore/appSelectors';
import { guestUserRegex } from '../../common/helpers/regexHelpers';

import './SideBar.less';

const SideBar = ({ intl }) => {
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
  const [showJudges, setShowJudges] = useState(false);

  useEffect(() => {
    if (authUserName && !guestUserRegex.test(authUserName)) {
      checkPayblesWarning(authUserName).then(res => {
        setWithWarning(res.warning);
      });
    }
    getJudgeRewardsMain(authUserName, 0).then(res => {
      setShowJudges(!isEmpty(res?.rewards));
    });
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
        configItem={showJudges ? rewardsWithJudgesSettings : rewardsSettings}
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
          {intl.formatMessage({
            id: 'for_more_options',
            defaultMessage: 'For more options please',
          })}{' '}
          <ModalSignIn isButton={false} />
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
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default injectIntl(SideBar);
