import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo/UserInfo';
import SettingsSidenav from '../../components/Navigation/SettingsSidenav/SettingsSidenav';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import SidenavRewards from '../../components/Navigation/SidenavRewards';
import SidenavDiscoverObjects from '../../discoverObjects/SidenavDiscoverObjects';
import URL from '../../../routes/constants';
import SideBar from '../../newRewards/SideBar';

const LeftSidebar = () => {
  const isWidget =
    typeof location !== 'undefined' && new URLSearchParams(location.search).get('display');

  return (
    !isWidget && (
      <Switch>
        <Route path="/@:name/wallet" component={SidebarMenu} />
        <Route path="/@:name" component={UserInfo} />
        <Route path="/object/:name" component={UserInfo} />
        <Route
          path={`/rewards/(${URL.REWARDS.sideBar})/:campaignName?`}
          component={SidenavRewards}
        />
        <Route path="/(discover-objects|discover)/:typeName?" component={SidenavDiscoverObjects} />
        <Route path={`/rewards/(${URL.REWARDS.sideBar})`} component={SidenavRewards} />
        <Route path={`/rewards-new/(${URL.REWARDS.sideBar})`} component={SideBar} />
        <Route path="/rewards/details/:campaignName" component={SidenavRewards} />
        <Route path="/rewards/referral-details/:userName" component={SidenavRewards} />
        <Route path="/rewards/referral-instructions/:userName" component={SidenavRewards} />
        <Route path="/rewards/referral-status/:userName/:table?" component={SidenavRewards} />
        <Route path="/rewards/createDuplicate/:campaignName" component={SidenavRewards} />
        <Route path="/discover-objects/:typeName?" component={SidenavDiscoverObjects} />
        <Route path="/discover" component={SidenavDiscoverObjects} />
        <Route path="/replies" component={SidebarMenu} />
        <Route path={`/(${URL.SETTINGS.tabs})`} component={SettingsSidenav} />
        <Route path={`/:site/(${URL.WEBSITES.tabs})`} component={SettingsSidenav} />
        <Route path="/" component={SidebarMenu} />
      </Switch>
    )
  );
};

export default LeftSidebar;
