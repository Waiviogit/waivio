import React from 'react';
import { Tabs } from 'antd';
import StatisticPage from './StatisticPage';
import SwapHistory from './SwapHistory';

const WaivPage = () => (
  <div className={'container feed-layout WaivPage'}>
    <Tabs defaultActiveKey={1}>
      <Tabs.TabPane tab="WAIV statistic" key={1}>
        <StatisticPage />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Trade history" key={2}>
        <SwapHistory />
      </Tabs.TabPane>
    </Tabs>
  </div>
);

export default WaivPage;
