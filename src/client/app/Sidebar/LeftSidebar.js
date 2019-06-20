import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserInfo from './UserInfo';
import SidenavUser from '../../components/Navigation/SidenavUser';
import ObjectTypes from '../../components/Sidebar/ObjectTypes/ObjectTypes';
import SidenavRewards from '../../components/Navigation/SidenavRewards';

const LeftSidebar = () => (
  <Switch>
    <Route path="/@:name/wallet" component={ObjectTypes} />
    <Route path="/@:name" component={UserInfo} />
    <Route path="/object/:name" component={UserInfo} />
    <Route path="/activity" component={SidenavUser} />
    <Route
      path="/rewards/(active|reserved|history|promoted)/@:userName"
      component={SidenavRewards}
    />
    <Route path="/replies" component={ObjectTypes} />
    <Route path="/bookmarks" component={SidenavUser} />
    <Route path="/drafts" component={SidenavUser} />
    <Route path="/edit-profile" component={SidenavUser} />
    <Route path="/settings" component={SidenavUser} />
    <Route path="/invite" component={SidenavUser} />
    <Route path="/" component={ObjectTypes} />
  </Switch>
);

export default LeftSidebar;
