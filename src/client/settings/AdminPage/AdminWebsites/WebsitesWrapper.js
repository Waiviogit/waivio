import React from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { Link, useLocation } from 'react-router-dom';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import AdminWebsites from './AdminWebsites';
import AdminCredits from '../AdminCredits/AdminCredits';
import AdminSubscriptions from '../AdminSubscriptions/AdminSubscriptions';

const tabs = { websites: 'websites', credits: 'credits', subscriptions: 'subscriptions' };

const WebsitesWrapper = () => {
  const title = `Website statistics`;
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname.includes(tabs.credits)) return tabs.credits;
    if (location.pathname.includes(tabs.subscriptions)) return tabs.subscriptions;

    return tabs.websites;
  };

  return (
    <div className="shifted">
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="container settings-layout">
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        <div className={classNames('center')}>
          <MobileNavigation />
          <Tabs className="Wallets" activeKey={getActiveTab()} animated={false}>
            <Tabs.TabPane tab={<Link to="/admin-websites">Websites</Link>} key={tabs.websites}>
              <AdminWebsites />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Link to="/admin-credits">Credits</Link>} key={tabs.credits}>
              <AdminCredits />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={<Link to="/admin-subscriptions">Subscriptions</Link>}
              key={tabs.subscriptions}
            >
              <AdminSubscriptions />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WebsitesWrapper;
