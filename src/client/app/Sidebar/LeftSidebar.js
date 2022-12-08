import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo/UserInfo';
import SettingsSidenav from '../../components/Navigation/SettingsSidenav/SettingsSidenav';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
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
        <Route path="/(discover-objects|discover)/:typeName?" component={SidenavDiscoverObjects} />
        <Route path={`/rewards/(${URL.NEW_REWARDS.sideBar})`} component={SideBar} />
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
