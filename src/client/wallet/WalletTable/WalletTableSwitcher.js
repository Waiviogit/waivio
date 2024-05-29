import React from 'react';
import { Tabs } from 'antd';
import { injectIntl, intlShape } from 'react-intl';

import WalletTable from './WalletTable';

// import GenerateReport from './GenerateReport';

const WalletTableSwitcher = ({ intl }) => (
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
    {/* <Tabs.TabPane */}
    {/*  tab={intl.formatMessage({ */}
    {/*    id: 'Generate', */}
    {/*    defaultMessage: 'Generate', */}
    {/*  })} */}
    {/*  key={'general'} */}
    {/* > */}
    {/*  <GenerateReport /> */}
    {/* </Tabs.TabPane> */}
  </Tabs>
);

WalletTableSwitcher.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(WalletTableSwitcher);
