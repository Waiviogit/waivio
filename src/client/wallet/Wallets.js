import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Wallet from '../user/UserWallet';
import Transfer from './Transfer/Transfer';
import WAIVwallet from './WAIVwallet/WAIVwallet';
import { getTokenRates, setWalletType } from '../../store/walletStore/walletActions';

const Wallets = props => {
  const query = new URLSearchParams(props.location.search);
  const walletsType = query.get('type');

  useEffect(() => {
    props.setWalletType(walletsType);
    props.getTokenRates('WAIV');
  }, []);

  const handleOnChange = key => {
    props.setWalletType(key);
    props.history.push(`?type=${key}`);
  };

  return (
    <React.Fragment>
      <Tabs defaultActiveKey={walletsType} onChange={handleOnChange}>
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
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
};

export default connect(null, { getTokenRates, setWalletType })(Wallets);
