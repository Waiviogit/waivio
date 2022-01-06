import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Wallet from '../user/UserWallet';
import Transfer from './Transfer/Transfer';
import WAIVwallet from './WAIVwallet/WAIVwallet';
import {
  getGlobalProperties,
  getTokenBalance,
  setWalletType,
} from '../../store/walletStore/walletActions';
import {
  getIsPowerUpOrDownVisible,
  getIsTransferVisible,
} from '../../store/walletStore/walletSelectors';
import { getCryptoPriceHistory } from '../../store/appStore/appActions';
import PowerUpOrDown from './PowerUpOrDown/PowerUpOrDown';
import HiveEngineWallet from './HiveEngineWallet/HiveEngineWallet';
import { guestUserRegex } from '../helpers/regexHelpers';
import SwapTokens from './SwapTokens/SwapTokens';
import { getVisibleModal } from '../../store/swapStore/swapSelectors';

const Wallets = props => {
  const query = new URLSearchParams(props.location.search);
  const walletsType = query.get('type');
  const isGuestUser = guestUserRegex.test(props.match.params.name);

  useEffect(() => {
    props.setWalletType(walletsType);
    props.getTokenBalance('WAIV', props.match.params.name);
    props.getCryptoPriceHistory();
    props.getGlobalProperties();
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
        {!isGuestUser && (
          <Tabs.TabPane tab="HIVE Engine wallet" key="ENGINE">
            <HiveEngineWallet />
          </Tabs.TabPane>
        )}
      </Tabs>
      {props.visible && <Transfer history={props.history} />}
      {props.visiblePower && <PowerUpOrDown />}
      {props.visibleSwap && <SwapTokens />}
    </React.Fragment>
  );
};

Wallets.propTypes = {
  setWalletType: PropTypes.func.isRequired,
  getCryptoPriceHistory: PropTypes.func.isRequired,
  getTokenBalance: PropTypes.func.isRequired,
  getGlobalProperties: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  visiblePower: PropTypes.bool.isRequired,
  visibleSwap: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
};

export default connect(
  state => ({
    visible: getIsTransferVisible(state),
    visiblePower: getIsPowerUpOrDownVisible(state),
    visibleSwap: getVisibleModal(state),
  }),
  {
    setWalletType,
    getCryptoPriceHistory,
    getTokenBalance,
    getGlobalProperties,
  },
)(Wallets);
