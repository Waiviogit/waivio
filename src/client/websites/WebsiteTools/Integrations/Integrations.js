import React from 'react';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';
import Shopify from './Shopify/Shopify';

const Integrations = () => (
  <div>
    <Tabs className="Wallets" activeKey={'shopify'} animated={false}>
      <Tabs.TabPane tab={<Link to="/shopify">Shopify</Link>} key={'shopify'}>
        <Shopify />
      </Tabs.TabPane>
    </Tabs>
  </div>
);

export default Integrations;
