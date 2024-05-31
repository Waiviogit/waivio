import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import GenerateReport from './GenerateReport';
import BothWalletTable from './BothWalletTable';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import useQuery from '../../../hooks/useQuery';
import { openWalletTable } from '../../../store/walletStore/walletActions';

const WalletTableSwitcher = props => {
  const authUser = useSelector(getAuthenticatedUserName);
  const { name } = useParams();
  const dispatch = useDispatch();
  const query = useQuery();
  const tab = query.get('tab');

  useEffect(() => {
    dispatch(openWalletTable());
  }, []);

  return (
    <Tabs defaultActiveKey={tab} activeKey={tab}>
      <Tabs.TabPane
        key={'standard'}
        tab={
          <Link to={`/@${name}/transfers/waiv-table?tab=standard`}>
            {props.intl.formatMessage({
              id: 'standard',
              defaultMessage: 'Standard',
            })}
          </Link>
        }
      >
        <BothWalletTable />
      </Tabs.TabPane>
      {authUser === name && (
        <Tabs.TabPane
          tab={
            <Link to={`/@${name}/transfers/waiv-table?tab=generate`}>
              {props.intl.formatMessage({
                id: 'Generated',
                defaultMessage: 'Generated',
              })}
            </Link>
          }
          key={'generate'}
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
