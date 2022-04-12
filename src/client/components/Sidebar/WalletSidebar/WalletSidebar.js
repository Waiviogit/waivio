import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import {
  openTransfer,
  openPowerUpOrDown,
  openWithdraw,
  toggleDepositModal,
  toggleDelegateModal,
} from '../../../../store/walletStore/walletActions';
import Action from '../../Button/Action';
import ClaimRewardsBlock from '../../../wallet/ClaimRewardsBlock/ClaimRewardsBlock';
import CryptoTrendingCharts from '../CrypoCharts/CryptoTrendingCharts';
import { openLinkHiveAccountModal } from '../../../../store/settingsStore/settingsActions';
import { getAuthenticatedUser, isGuestUser } from '../../../../store/authStore/authSelectors';
import { getHiveBeneficiaryAccount } from '../../../../store/settingsStore/settingsSelectors';
import withAuthActions from '../../../auth/withAuthActions';
import { getCurrentWalletType } from '../../../../store/walletStore/walletSelectors';
import { toggleModal } from '../../../../store/swapStore/swapActions';
import { HBD, HIVE, WAIV } from '../../../../common/constants/cryptos';

import './WalletSidebar.less';
import { toggleWithdrawModal } from '../../../../store/depositeWithdrawStore/depositeWithdrawAction';
import SellOrdersTable from '../../../wallet/SellOrdersTable';
import BuyOrdersTable from '../../../wallet/BuyOrdersTable';
import { guestUserRegex } from '../../../../common/helpers/regexHelpers';

const cryptos = [WAIV.symbol, HIVE.symbol, HBD.symbol];

@withAuthActions
@withRouter
@connect(
  state => ({
    isGuest: isGuestUser(state),
    user: getAuthenticatedUser(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
    walletType: getCurrentWalletType(state),
  }),
  {
    openTransfer,
    openPowerUpOrDown,
    openWithdraw,
    toggleWithdrawModal,
    openLinkHiveAccountModal,
    openSwapTokensModal: toggleModal,
    openDepositModal: toggleDepositModal,
    toggleDelegateModal,
  },
)
class WalletSidebar extends React.Component {
  static propTypes = {
    user: PropTypes.shape(),
    isCurrentUser: PropTypes.bool,
    match: PropTypes.shape().isRequired,
    openTransfer: PropTypes.func.isRequired,
    openPowerUpOrDown: PropTypes.func.isRequired,
    openDepositModal: PropTypes.func.isRequired,
    toggleWithdrawModal: PropTypes.func.isRequired,
    isGuest: PropTypes.bool,
    openWithdraw: PropTypes.func.isRequired,
    openLinkHiveAccountModal: PropTypes.func.isRequired,
    openSwapTokensModal: PropTypes.func.isRequired,
    hiveBeneficiaryAccount: PropTypes.string,
    walletType: PropTypes.string.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
    toggleDelegateModal: PropTypes.func.isRequired,
  };

  static defaultProps = {
    user: {},
    isCurrentUser: false,
    isGuest: false,
    hiveBeneficiaryAccount: '',
  };

  handleOpenTransfer = () => {
    const { match, user, isCurrentUser, hiveBeneficiaryAccount, isGuest } = this.props;
    const username = match.params.name === user.name || isCurrentUser ? '' : match.params.name;

    if (!hiveBeneficiaryAccount && isGuest) this.props.openLinkHiveAccountModal(true);
    this.props.openTransfer(username);
  };

  handleOpenTransferWithAuth = () => this.props.onActionInitiated(this.handleOpenTransfer);

  handleOpenPowerUp = () => {
    this.props.openPowerUpOrDown();
  };

  handleOpenPowerDown = () => {
    this.props.openPowerUpOrDown(true);
  };

  handleOpenSwapModal = () => this.props.openSwapTokensModal(true);

  handleOpenWithdrawModal = () => this.props.toggleWithdrawModal(true);

  handleOpenDelegateModal = () => this.props.toggleDelegateModal();

  handleOpenDepositModal = () => this.props.openDepositModal();

  render() {
    const { match, user, isCurrentUser, isGuest, walletType } = this.props;
    const ownProfile = match.params.name === user.name || isCurrentUser;
    const isNotWaivWallet = walletType !== 'WAIV';
    const isGuestUserProfile = guestUserRegex.test(this.props.match.params.name);

    return (
      <div className="WalletSidebar">
        <Action
          big
          className="WalletSidebar__transfer"
          primary
          onClick={this.handleOpenTransferWithAuth}
        >
          <FormattedMessage id="transfer" defaultMessage="Transfer" />
        </Action>
        {ownProfile && !isGuest && (
          <div className="WalletSidebar__power">
            <Action big onClick={this.handleOpenPowerUp}>
              <FormattedMessage id="power_up" defaultMessage="Power up" />
            </Action>
            <Action big onClick={this.handleOpenPowerDown}>
              <FormattedMessage id="power_down" defaultMessage="Power down" />
            </Action>
          </div>
        )}
        {ownProfile && !isGuest && (
          <Action big onClick={this.handleOpenDelegateModal} className="WalletSidebar__transfer">
            <FormattedMessage id="manage_delegations" />
          </Action>
        )}
        {<CryptoTrendingCharts cryptos={cryptos} />}
        {ownProfile && <ClaimRewardsBlock />}
        {!isEmpty(user) && ownProfile && isGuest && isNotWaivWallet && (
          <Action big className="WalletSidebar__transfer" primary onClick={this.props.openWithdraw}>
            <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
          </Action>
        )}
        {!isEmpty(user) && ownProfile && !isGuest && (
          <Action
            big
            className="WalletSidebar__transfer"
            primary
            onClick={this.handleOpenSwapModal}
          >
            <FormattedMessage id="swap_tokens" defaultMessage="Swap tokens" />
          </Action>
        )}
        {!isEmpty(user) && ownProfile && !isGuest && (
          <div className="WalletSidebar__power">
            <Action big className="WalletSidebar__transfer" onClick={this.handleOpenDepositModal}>
              <FormattedMessage id="Deposit" defaultMessage="Deposit" />
            </Action>
            <Action big className="WalletSidebar__transfer" onClick={this.handleOpenWithdrawModal}>
              <FormattedMessage id="Withdraw" defaultMessage="Withdraw" />
            </Action>
          </div>
        )}
        {!isGuestUserProfile && (
          <React.Fragment>
            <BuyOrdersTable />
            <SellOrdersTable />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default WalletSidebar;
