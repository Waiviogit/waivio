import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo/UserInfo';
import SettingsSidenav from '../../components/Navigation/SettingsSidenav/SettingsSidenav';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import SidenavRewards from '../../components/Navigation/SidenavRewards';
import SidenavDiscoverObjects from '../../discoverObjects/SidenavDiscoverObjects';
import URL from '../../../common/routes/constants';

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
        <Route path="/rewards/match-bots-sponsors" component={SidenavRewards} />
        <Route path="/rewards/match-bots-curators" component={SidenavRewards} />
        <Route path="/rewards/match-bots-authors" component={SidenavRewards} />
        <Route path="/rewards/fraud-detection" component={SidenavRewards} />
        <Route path="/rewards/blacklist" component={SidenavRewards} />
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
