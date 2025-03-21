import React from 'react';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import Affix from '../../../components/Utils/Affix';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';

import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import AdminWebsites from './AdminWebsites';
import AdminCredits from './AdminCredits/AdminCredits';

const WebsitesWrapper = () => {
  const title = `Website statistics`;

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
          <Tabs className="Wallets" defaultActiveKey={''} onChange={() => {}}>
            <Tabs.TabPane tab={<Link to={`admin-websites`}>Websites</Link>} key="websites">
              <AdminWebsites />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<Link to={`admin-credits`}>Credits</Link>} key="credits">
              <AdminCredits />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WebsitesWrapper;
