import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Wallet from '../user/UserWallet';
import Transfer from './Transfer/Transfer';
import WAIVwallet from './WAIVwallet/WAIVwallet';
import { getTokenRates } from '../../store/walletStore/walletActions';

const Wallets = props => {
  useEffect(() => {
    props.getTokenRates('WAIV');
  }, []);

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="WAIV wallet" key="1">
          <WAIVwallet />
        </Tabs.TabPane>
        <Tabs.TabPane tab="HIVE wallet" key="2">
          <Wallet />
        </Tabs.TabPane>
      </Tabs>
      <Transfer history={props.history} />
    </React.Fragment>
  );
};

Wallets.propTypes = {
  getTokenRates: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default connect(null, { getTokenRates })(Wallets);
