import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserInfo from './UserInfo/UserInfo';
import SettingsSidenav from '../../components/Navigation/SettingsSidenav/SettingsSidenav';
import SidebarMenu from '../../components/Sidebar/SidebarMenu';
import SidenavDiscoverObjects from '../../discoverObjects/SidenavDiscoverObjects';
import URL from '../../../routes/constants';
import SideBar from '../../newRewards/SideBar';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import GlobalShopDepartments from '../../Shop/ShopDepartments/GlobalShopDepartments';
import { getIsSocial } from '../../../store/appStore/appSelectors';
import DepartmentsWobject from '../../object/ObjectTypeShop/DepartmentsWobject';
import WobjectShopFilter from '../../object/ObjectTypeShop/WobjectShopFilter';
import UserFilters from '../../Shop/ShopFilters/UserFilters';
import FavoritesSideNav from '../../components/Favorites/FavoritesSideNav';
import AdminSidenav from '../../components/Navigation/AdminSidenav/AdminSidenav';
import useAdLevelData from '../../../hooks/useAdsense';
import GoogleAds from '../../adsenseAds/GoogleAds';

const LeftSidebar = () => {
  const isWidget =
    typeof location !== 'undefined' && new URLSearchParams(location.search).get('display');
  const isSocial = useSelector(getIsSocial);
  const { minimal, intensive, moderate } = useAdLevelData();

  return (
    !isWidget && (
      <Switch>
        <Route path={'/shop/:department?'} component={GlobalShopDepartments} />
        <Route path={'/@:name/favorites/:objectType?'} component={FavoritesSideNav} />
        <Route
          path={'/object-shop/:name/:department?'}
          render={() => (
            <div>
              <DepartmentsWobject />
              <WobjectShopFilter />
              {(minimal || moderate || intensive) && <GoogleAds inFeed />}
            </div>
          )}
        />
        <Route path="/@:name/userShop/:department?" component={DepartmentsUser} />
        <Route path="/@:name/recipe/:department?" component={DepartmentsUser} />
        <Route
          path="/user-shop/:name/:department?"
          render={() => (
            <div>
              <DepartmentsUser isSocial />
              <UserFilters />
              {(minimal || moderate || intensive) && <GoogleAds inFeed />}
            </div>
          )}
        />{' '}
        <Route
          path="/recipe/:name/:department?"
          render={() => (
            <div>
              <DepartmentsUser isSocial />
              <UserFilters />
              {(minimal || moderate || intensive) && <GoogleAds inFeed />}
            </div>
          )}
        />
        u
        <Route path="/@:name/wallet" component={SidebarMenu} />
        <Route path="/@:name" component={UserInfo} />
        <Route path="/object/:name" component={UserInfo} />
        <Route path="/(discover-objects|discover)/:typeName?" component={SidenavDiscoverObjects} />
        <Route path={`/rewards/(${URL.NEW_REWARDS.sideBar})`} component={SideBar} />
        <Route path="/discover-objects/:typeName?" component={SidenavDiscoverObjects} />
        <Route path="/discover" component={SidenavDiscoverObjects} />
        <Route path="/replies" component={SidebarMenu} />
        <Route path={`/(${URL.SETTINGS.tabs})`} component={SettingsSidenav} />
        <Route path={`/(${URL.ADMIN.tabs})`} component={AdminSidenav} />
        <Route path={`/:site/(${URL.WEBSITES.tabs})`} component={SettingsSidenav} />
        {isSocial && <Route path={'/:department?'} component={GlobalShopDepartments} />}
        <Route path="/" component={SidebarMenu} />
      </Switch>
    )
  );
};

export default LeftSidebar;
