import React from 'react';
import { Tabs } from 'antd';
import { useRouteMatch } from 'react-router';
import { injectIntl } from 'react-intl';

import WalletTable from './WalletTable';

import GenerateReport from './GenerateReport';

const WalletTableSwitcher = ({ intl }) => {
  return (
    <Tabs>
      <Tabs.TabPane
        key={'standard'}
        tab={intl.formatMessage({
          id: 'standard',
          defaultMessage: 'Standard',
        })}
      >
        <WalletTable />
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={intl.formatMessage({
          id: 'Generate',
          defaultMessage: 'Generate',
        })}
        key={'general'}
      >
        <GenerateReport />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default injectIntl(WalletTableSwitcher);
