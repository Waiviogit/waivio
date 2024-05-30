import React from 'react';
import { Tabs } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import GenerateReport from './GenerateReport';
import BothWalletTable from './BothWalletTable';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const WalletTableSwitcher = props => {
  const authUser = useSelector(getAuthenticatedUserName);
  const { name } = useParams();

  return (
    <Tabs>
      <Tabs.TabPane
        key={'standard'}
        tab={props.intl.formatMessage({
          id: 'standard',
          defaultMessage: 'Standard',
        })}
      >
        <BothWalletTable />
      </Tabs.TabPane>
      {authUser === name && (
        <Tabs.TabPane
          tab={props.intl.formatMessage({
            id: 'Generated',
            defaultMessage: 'Generated',
          })}
          key={'general'}
        >
          <GenerateReport />
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};

WalletTableSwitcher.propTypes = {
  intl: intlShape.isRequired,
};

export default injectIntl(WalletTableSwitcher);
