import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo';
import SidenavUser from '../../components/Navigation/SidenavUser';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import SidenavRewards from '../../components/Navigation/SidenavRewards';
import SidenavDiscoverObjects from '../../discoverObjects/SidenavDiscoverObjects';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name/wallet" component={SidebarMenu} />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/object/:name" component={UserInfo} />
    <Route path="/activity" component={SidenavUser} />
    <Route path="/rewards/(active|reserved|history|promoted|created)" component={SidenavRewards} />
    <Route path="/rewards/all" component={SidenavRewards} />
    <Route path="/rewards/create" component={SidenavRewards} />
    <Route path="/rewards/manage" component={SidenavRewards} />
    <Route path="/rewards/match-bot" component={SidenavRewards} />
    <Route path="/rewards/edit/#:campaignName" component={SidenavRewards} />
    <Route path="/discover-objects/:typeName?" component={SidenavDiscoverObjects} />
    <Route path="/replies" component={SidebarMenu} />
    <Route path="/bookmarks" component={SidenavUser} />
    <Route path="/drafts" component={SidenavUser} />
    <Route path="/edit-profile" component={SidenavUser} />
    <Route path="/settings" component={SidenavUser} />
    <Route path="/invite" component={SidenavUser} />
    <Route path="/" component={SidebarMenu} />

  </Switch>
);

export default LeftSidebar;
