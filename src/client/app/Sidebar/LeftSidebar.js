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
    <Route path="/@:name/transfers/table" />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/object/:name" component={UserInfo} />
    <Route
      path="/rewards/(active|reserved|history|promoted|created|receivables)"
      component={SidenavRewards}
    />
    <Route path="/rewards/all" component={SidenavRewards} />
    <Route path="/rewards/create" component={SidenavRewards} />
    <Route path="/rewards/manage" component={SidenavRewards} />
    <Route path="/rewards/payables" component={SidenavRewards} />
    <Route path="/rewards/reports" component={SidenavRewards} />
    <Route path="/rewards/guideHistory" component={SidenavRewards} />
    <Route path="/rewards/messages" component={SidenavRewards} />
    <Route path="/rewards/match-bot" component={SidenavRewards} />
    <Route path="/rewards/blacklist" component={SidenavRewards} />
    <Route path="/rewards/details/:campaignName" component={SidenavRewards} />
    <Route path="/rewards/createDuplicate/:campaignName" component={SidenavRewards} />
    <Route path="/discover-objects/:typeName?" component={SidenavDiscoverObjects} />
    <Route path="/discover" component={SidenavDiscoverObjects} />
    <Route path="/replies" component={SidebarMenu} />
    <Route path="/bookmarks" component={SidenavUser} />
    <Route path="/drafts" component={SidenavUser} />
    <Route path="/edit-profile" component={SidenavUser} />
    <Route path="/settings" component={SidenavUser} />
    <Route path="/invite" component={SidenavUser} />
    <Route path="/guests-settings" component={SidenavUser} />
    <Route path="/notification-settings" component={SidenavUser} />
    <Route path="/" component={SidebarMenu} />
  </Switch>
);

export default LeftSidebar;
