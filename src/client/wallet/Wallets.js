import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Wallet from '../user/UserWallet';
import Transfer from './Transfer/Transfer';
import WAIVwallet from './WAIVwallet/WAIVwallet';
import { getTokenRates, setWalletType } from '../../store/walletStore/walletActions';

const Wallets = props => {
  useEffect(() => {
    props.getTokenRates('WAIV');
  }, []);

  return (
    <React.Fragment>
      <Tabs defaultActiveKey="WAIV" onChange={key => props.setWalletType(key)}>
        <Tabs.TabPane tab="WAIV wallet" key="WAIV">
          <WAIVwallet />
        </Tabs.TabPane>
        <Tabs.TabPane tab="HIVE wallet" key="HIVE">
          <Wallet />
        </Tabs.TabPane>
      </Tabs>
      <Transfer history={props.history} />
    </React.Fragment>
  );
};

Wallets.propTypes = {
  getTokenRates: PropTypes.func.isRequired,
  setWalletType: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
};

export default connect(null, { getTokenRates, setWalletType })(Wallets);
