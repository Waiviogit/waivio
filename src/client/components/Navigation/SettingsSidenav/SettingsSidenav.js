import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import {
  currentWebsiteSettings,
  dataManagementSettings,
  personalSettings,
  websiteSettings,
} from './constants';
import SettingsItem from './SettingsItem';
import { getIsWaivio } from '../../../../store/appStore/appSelectors';
import { isGuestUser } from '../../../../store/authStore/authSelectors';
import { getOwnWebsites } from '../../../../store/websiteStore/websiteSelectors';

import '../Sidenav.less';

const SettingsSidenav = ({ match }) => {
  const isGuest = useSelector(isGuestUser);
  const ownWebsite = useSelector(getOwnWebsites);
  const isWaivio = useSelector(getIsWaivio);
  const [menuCondition, setMenuCondition] = useState({
    personal: true,
    websites: true,
    dataManagement: true,
  });

  const createWebsiteConditions = value => {
    const websiteItems = value.reduce((acc, { host }) => {
      acc[host] = host === match.params.site;

      return acc;
    }, {});

    setMenuCondition(prevState => ({ ...prevState, ...websiteItems }));
  };

  useEffect(() => {
    if (!isGuest && isWaivio) createWebsiteConditions(ownWebsite);
  }, [ownWebsite]);

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <ul className="Sidenav SettingsSidenav">
      <SettingsItem
        condition={menuCondition.personal}
        configItem={personalSettings}
        toggleMenuCondition={toggleMenuCondition}
      />
      {isWaivio && (
        <SettingsItem
          condition={menuCondition.dataManagement}
          configItem={dataManagementSettings}
          toggleMenuCondition={toggleMenuCondition}
        />
      )}
      {isWaivio && (
        <React.Fragment>
          <SettingsItem
            condition={menuCondition.websites}
            configItem={websiteSettings}
            toggleMenuCondition={toggleMenuCondition}
          />
          {map(ownWebsite, ({ host, parentHost }) => (
            <SettingsItem
              key={host}
              condition={menuCondition[host]}
              configItem={{
                tab: {
                  name: host,
                  id: host,
                  defaultMessage: host,
                },
                settings: currentWebsiteSettings(host, parentHost),
              }}
              toggleMenuCondition={toggleMenuCondition}
            />
          ))}
        </React.Fragment>
      )}
    </ul>
  );
};

SettingsSidenav.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
};

export default SettingsSidenav;
