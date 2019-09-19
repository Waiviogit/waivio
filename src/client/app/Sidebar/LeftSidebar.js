import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo';
import TopInstruments from './TopInstruments';
import TopPerformers from './TopPerformers/TopPerformers';
import MarketsList from './MarketsList';
import SidenavUser from '../../components/Navigation/SidenavUser';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import SidenavRewards from '../../components/Navigation/SidenavRewards';
import SidenavDiscoverObjects from '../../discoverObjects/SidenavDiscoverObjects';
import DealsList from './DealsList';

const LeftSidebar = ({ quoteSettingsSorted }) => (
  <Switch>
    <Route path="/@:name/wallet" component={TopInstruments} />
    <Route path="/my_feed" component={TopInstruments} />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/object/:name" component={UserInfo} />
    <Route
      path="/markets/:marketType"
      render={props => <MarketsList quoteSettingsSorted={quoteSettingsSorted} {...props} />}
    />
    <Route path="/deals/:dealType" component={DealsList} />
    <Route path="/activity" component={SidenavUser} />
    <Route path="/rewards/(active|reserved|history|promoted|created)" component={SidenavRewards} />
    <Route path="/rewards/all" component={SidenavRewards} />
    <Route path="/rewards/create" component={SidenavRewards} />
    <Route path="/rewards/manage" component={SidenavRewards} />
    <Route path="/rewards/match-bot" component={SidenavRewards} />
    <Route path="/discover-objects/:typeName?" component={SidenavDiscoverObjects} />
    <Route path="/replies" component={SidebarMenu} />
    <Route path="/bookmarks" component={SidenavUser} />
    <Route path="/drafts" component={SidenavUser} />
    <Route path="/edit-profile" component={SidenavUser} />
    <Route path="/settings" component={SidenavUser} />
    <Route path="/invite" component={SidenavUser} />
    <Route path="/" component={TopPerformers} />
  </Switch>
);

LeftSidebar.propTypes = {
  quoteSettingsSorted: PropTypes.shape(),
};

LeftSidebar.defaultProps = {
  quoteSettingsSorted: null,
};

export default LeftSidebar;
