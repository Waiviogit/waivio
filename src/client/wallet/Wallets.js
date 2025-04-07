import React, { useEffect } from 'react';
import { Tabs } from 'antd';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Wallet from '../user/UserWallet';
import Transfer from './Transfer/Transfer';
import WAIVwallet from './WAIVwallet/WAIVwallet';
import {
  getCurrUserTokensBalanceList,
  getCurrUserTokensBalanceSwap,
  getGlobalProperties,
  getTokenBalance,
  getUserTokensBalanceList,
  resetHiveEngineTokenBalance,
  setWalletType,
} from '../../store/walletStore/walletActions';
import {
  getDelegateRcModalVisible,
  getDelegationModalVisible,
  getDepositVisible,
  getIsPowerUpOrDownVisible,
  getIsTransferVisible,
  getManageRcModalVisible,
} from '../../store/walletStore/walletSelectors';
import PowerUpOrDown from './PowerUpOrDown/PowerUpOrDown';
import HiveEngineWallet from './HiveEngineWallet/HiveEngineWallet';
import { guestUserRegex } from '../../common/helpers/regexHelpers';
import SwapTokens from './SwapTokens/SwapTokens';
import { getVisibleConvertModal, getVisibleModal } from '../../store/swapStore/swapSelectors';
import Deposit from './Deposit/Deposit';
import WithdrawModal from './WithdrawModal/WithdrawModal';
import { getIsOpenWithdraw } from '../../store/depositeWithdrawStore/depositWithdrawSelector';
import ManageDelegate from './DelegateModals/ManageDelegate/ManageDelegate';
import { getAuthenticatedUserName } from '../../store/authStore/authSelectors';
import Rebalancing from '../newRewards/Rebalancing/Rebalancing';
import ConvertHbdModal from './ConvertHbdModal/ConvertHbdModal';
import DelegateRcModal from './DelegateModals/DelegateRc/DelegateRcModal';
import ManageRcDelegations from './DelegateModals/ManageRcDelegations/ManageRcDelegations';
import './Wallets.less';

const Wallets = props => {
  const query = new URLSearchParams(props.location.search);
  const walletsType = query.get('type');
  const isGuestUser = guestUserRegex.test(props.match.params.name);
  const isCurrUser = props.match.params.name === props.authUserName;
  const isWaiv = walletsType === 'WAIV';
  const isHive = walletsType === 'HIVE';
  const isHiveEngine = walletsType === 'ENGINE';

  useEffect(() => {
    props.setWalletType(walletsType);
    props.getGlobalProperties();
    // props.getTokenBalance('WAIV', props.match.params.name);

    if (!guestUserRegex.test(props.authUserName))
      props.getUserTokensBalanceList(props.authUserName);

    // if (!isGuestUser) {
    // props.getCurrUserTokensBalanceSwap(props.match.params.name); //e
    // props.getCurrUserTokensBalanceList(props.match.params.name); //e
    // }

    return () => props.resetHiveEngineTokenBalance();
  }, [props.authUserName]);

  const handleOnChange = key => props.setWalletType(key);

  return (
    <React.Fragment>
      <Tabs className="Wallets" defaultActiveKey={walletsType} onChange={handleOnChange}>
        <Tabs.TabPane
          tab={<Link to={`/@${props.match.params.name}/transfers?type=WAIV`}>WAIV</Link>}
          key="WAIV"
        >
          {isWaiv && <WAIVwallet />}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={<Link to={`/@${props.match.params.name}/transfers?type=HIVE`}>HIVE</Link>}
          key="HIVE"
        >
          {isHive && <Wallet />}
        </Tabs.TabPane>
        {!isGuestUser && (
          <Tabs.TabPane
            tab={<Link to={`/@${props.match.params.name}/transfers?type=ENGINE`}>Hive Engine</Link>}
            key="ENGINE"
          >
            {isHiveEngine && <HiveEngineWallet />}
          </Tabs.TabPane>
        )}
        {!isGuestUser && isCurrUser && (
          <Tabs.TabPane
            tab={
              <Link to={`/@${props.match.params.name}/transfers?type=rebalancing`}>
                {props.intl.formatMessage({
                  id: 'rebalance_wallet',
                  defaultMessage: 'Rebalancing',
                })}
              </Link>
            }
            key="rebalancing"
          >
            {walletsType === 'rebalancing' && <Rebalancing />}
          </Tabs.TabPane>
        )}
      </Tabs>
      {props.visible && <Transfer history={props.history} />}
      {props.visiblePower && <PowerUpOrDown />}
      {props.visibleSwap && <SwapTokens />}
      {props.visibleConvert && <ConvertHbdModal />}
      {props.visibleDeposit && <Deposit />}
      {props.visibleWithdraw && <WithdrawModal />}
      {props.visibleDelegate && <ManageDelegate />}
      {props.visibleDelegateRc && <DelegateRcModal />}
      {props.visibleManageRc && <ManageRcDelegations />}
    </React.Fragment>
  );
};

Wallets.propTypes = {
  intl: PropTypes.shape().isRequired,
  setWalletType: PropTypes.func.isRequired,
  getUserTokensBalanceList: PropTypes.func.isRequired,
  getGlobalProperties: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  visiblePower: PropTypes.bool.isRequired,
  visibleSwap: PropTypes.bool.isRequired,
  visibleWithdraw: PropTypes.bool.isRequired,
  visibleDelegate: PropTypes.bool.isRequired,
  visibleDelegateRc: PropTypes.bool.isRequired,
  visibleManageRc: PropTypes.bool.isRequired,
  visibleConvert: PropTypes.bool.isRequired,
  resetHiveEngineTokenBalance: PropTypes.func.isRequired,
  visibleDeposit: PropTypes.bool.isRequired,
  authUserName: PropTypes.string.isRequired,
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
    visibleConvert: getVisibleConvertModal(state),
    visibleDeposit: getDepositVisible(state),
    visibleWithdraw: getIsOpenWithdraw(state),
    visibleDelegate: getDelegationModalVisible(state),
    visibleDelegateRc: getDelegateRcModalVisible(state),
    visibleManageRc: getManageRcModalVisible(state),
    authUserName: getAuthenticatedUserName(state),
  }),
  {
    setWalletType,
    getTokenBalance,
    getGlobalProperties,
    getCurrUserTokensBalanceList,
    resetHiveEngineTokenBalance,
    getCurrUserTokensBalanceSwap,
    getUserTokensBalanceList,
  },
)(injectIntl(Wallets));
