import classNames from 'classnames';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Tabs } from 'antd';
import { useHistory } from 'react-router';
import { useLocation } from 'react-router-dom';
import LeftSidebar from '../../../app/Sidebar/LeftSidebar';
import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import Affix from '../../../components/Utils/Affix';
import FAQTab from './FAQTab';

const tabs = {
  stats: 'stats',
  faq: 'faq',
};

const AiAssistant = () => {
  const title = 'AI Assistant';
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(tabs.faq);
  const history = useHistory();

  const getActiveTab = () => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');

    if (tabParam && tabs[tabParam]) {
      return tabs[tabParam];
    }

    return tabs.faq;
  };

  React.useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.search]);

  const handleTabChange = key => {
    setActiveTab(key);
    const newUrl = key === tabs.faq ? '/ai-assistant' : `/ai-assistant?tab=${key}`;

    history.push(newUrl);
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
          <div>
            <Tabs
              className="Wallets"
              activeKey={activeTab}
              onChange={handleTabChange}
              animated={false}
            >
              {/* <Tabs.TabPane tab="Stats" key={tabs.stats}> */}
              {/*   <StatsTab /> */}
              {/* </Tabs.TabPane> */}
              <Tabs.TabPane tab="FAQ" key={tabs.faq}>
                <FAQTab />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;
