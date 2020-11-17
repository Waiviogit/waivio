import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { currentWebsiteSettings, personalSettings, websiteSettings } from './constants';
import SettingsItem from './SettingsItem';
import { getOwnWebsites, isGuestUser } from '../../../reducers';
import { getOwnWebsite } from '../../../websites/websiteActions';

import '../Sidenav.less';

const SettingsSidenav = () => {
  const dispatch = useDispatch();
  const isGuest = useSelector(isGuestUser);
  const ownWebsite = useSelector(getOwnWebsites);
  const [menuCondition, setMenuCondition] = useState({
    personal: true,
    websites: true,
    ...ownWebsite.reduce((acc, curr) => {
      acc[curr] = false;

      return acc;
    }, {}),
  });

  useEffect(() => {
    if (!isGuest) dispatch(getOwnWebsite());
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
        condition={menuCondition.personal}
        configItem={personalSettings}
        toggleMenuCondition={toggleMenuCondition}
      />
      {!isGuest && (
        <SettingsItem
          condition={menuCondition.websites}
          configItem={websiteSettings}
          toggleMenuCondition={toggleMenuCondition}
        />
      )}
      {ownWebsite.map(website => (
        <SettingsItem
          key={website.host}
          condition={menuCondition[website.host]}
          configItem={{
            tab: {
              name: website.host,
              id: website.host,
              defaultMessage: website.host,
            },
            settings: currentWebsiteSettings(website.host),
          }}
          toggleMenuCondition={toggleMenuCondition}
        />
      ))}
    </ul>
  );
};

export default SettingsSidenav;
