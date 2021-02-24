import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { currentWebsiteSettings, personalSettings, websiteSettings } from './constants';
import SettingsItem from './SettingsItem';
import { getIsWaivio, getOwnWebsites, isGuestUser } from '../../../reducers';

import '../Sidenav.less';

const SettingsSidenav = ({ match }) => {
  const isGuest = useSelector(isGuestUser);
  const ownWebsite = useSelector(getOwnWebsites);
  const isWaivio = useSelector(getIsWaivio);
  const [menuCondition, setMenuCondition] = useState({
    personal: true,
    websites: true,
  });

  const createWebsiteConditions = value => {
    const websiteItems = value.reduce((acc, { host }) => {
      acc[host] = host === match.params.site;

      return acc;
    }, {});

    setMenuCondition(prevState => ({ ...prevState, ...websiteItems }));
  };

  useEffect(() => {
    createWebsiteConditions(ownWebsite);
  }, [ownWebsite]);

  const toggleMenuCondition = menuItem => {
    setMenuCondition({
      ...menuCondition,
      [menuItem]: !menuCondition[menuItem],
    });
  };

  return (
    <ul className="Sidenav">
      <SettingsItem
        condition={menuCondition.personal}
        configItem={personalSettings}
        toggleMenuCondition={toggleMenuCondition}
      />
      {!isGuest && isWaivio && (
        <React.Fragment>
          <SettingsItem
            condition={menuCondition.websites}
            configItem={websiteSettings}
            toggleMenuCondition={toggleMenuCondition}
          />
          {ownWebsite.map(({ host }) => (
            <SettingsItem
              key={host}
              condition={menuCondition[host]}
              configItem={{
                tab: {
                  name: host,
                  id: host,
                  defaultMessage: host,
                },
                settings: currentWebsiteSettings(host),
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
