import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tabs } from 'antd';
import ReportsWebsite from './ReportsWebsite';
import ActionsWebsite from './ActionsWebsite';

const tabs = { payments: 'payments', actions: 'Actions' };

const Reports = () => {
  const location = useLocation();

  const getActiveTab = () =>
    location.pathname?.includes(tabs.payments) ? tabs.payments : tabs.actions;

  return (
    <Tabs className="Wallets" activeKey={getActiveTab()} animated={false}>
      <Tabs.TabPane tab={<Link to="/payments">Billing</Link>} key={tabs.payments}>
        <ReportsWebsite />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<Link to="/actions">Actions</Link>} key={tabs.actions}>
        <ActionsWebsite />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default Reports;
