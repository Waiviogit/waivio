import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo';
import SidenavUser from '../../components/Navigation/SidenavUser';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import SidenavRewards from '../../components/Navigation/SidenavRewards';
import SidenavDiscoverObjects from '../../discoverObjects/SidenavDiscoverObjects';
import URL from '../../../common/routes/constants';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name/wallet" component={SidebarMenu} />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/object/:name" component={UserInfo} />
    <Route path={`/rewards/(${URL.REWARDS.sideBar})/:campaignName?`} component={SidenavRewards} />
    <Route path="/(discover-objects|discover)/:typeName?" component={SidenavDiscoverObjects} />
    <Route path="/replies" component={SidebarMenu} />
    <Route path={`/(${URL.SETTINGS.tabs})`} component={SidenavUser} />
    <Route path="/" component={SidebarMenu} />
  </Switch>
);

export default LeftSidebar;
