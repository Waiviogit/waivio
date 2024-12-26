import React from 'react';
import { Tabs } from 'antd';
import StatisticPage from './StatisticPage';
import SwapHistory from './SwapHistory';

import './WaivPage.less';

const WaivPage = () => (
  <div className={'container feed-layout'}>
    <Tabs className={'WaivPage'} defaultActiveKey={1}>
      <Tabs.TabPane tab="WAIV stats" key={1}>
        <StatisticPage />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Trading history" key={2}>
        <SwapHistory />
      </Tabs.TabPane>
    </Tabs>
  </div>
);

export default WaivPage;
