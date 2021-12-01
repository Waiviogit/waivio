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
} from '../../../../store/walletStore/walletActions';
import Action from '../../Button/Action';
import ClaimRewardsBlock from '../../../wallet/ClaimRewardsBlock';
import CryptoTrendingCharts from '../CryptoTrendingCharts';
import { openLinkHiveAccountModal } from '../../../../store/settingsStore/settingsActions';
import { getAuthenticatedUser, isGuestUser } from '../../../../store/authStore/authSelectors';
import { getHiveBeneficiaryAccount } from '../../../../store/settingsStore/settingsSelectors';

import './WalletSidebar.less';
import withAuthActions from '../../../auth/withAuthActions';
import { getCurrentWalletType } from '../../../../store/walletStore/walletSelectors';

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
    openLinkHiveAccountModal,
  },
)
class HiveWalletSidebar extends React.Component {
  static propTypes = {
    user: PropTypes.shape(),
    isCurrentUser: PropTypes.bool,
    match: PropTypes.shape().isRequired,
    cryptos: PropTypes.arrayOf(PropTypes.string).isRequired,
    openTransfer: PropTypes.func.isRequired,
    openPowerUpOrDown: PropTypes.func.isRequired,
    isGuest: PropTypes.bool,
    openWithdraw: PropTypes.func.isRequired,
    openLinkHiveAccountModal: PropTypes.func.isRequired,
    hiveBeneficiaryAccount: PropTypes.string,
    walletType: PropTypes.string.isRequired,
    onActionInitiated: PropTypes.func.isRequired,
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

  handleChartsLoading = () => {};

  render() {
    const { match, user, isCurrentUser, isGuest, cryptos } = this.props;
    const ownProfile = match.params.name === user.name || isCurrentUser;
    const steemBalance = user.balance ? String(user.balance).match(/^[\d.]+/g)[0] : 0;

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
        {ownProfile && !isGuest && this.props.walletType === 'HIVE' && (
          <div className="WalletSidebar__power">
            <Action big onClick={this.handleOpenPowerUp}>
              <FormattedMessage id="power_up" defaultMessage="Power up" />
            </Action>
            <Action big onClick={this.handleOpenPowerDown}>
              <FormattedMessage id="power_down" defaultMessage="Power down" />
            </Action>
          </div>
        )}
        {<CryptoTrendingCharts cryptos={cryptos} />}
        {ownProfile && <ClaimRewardsBlock />}
        <a
          href={`https://widget.blocktrades.us/trade?affiliate_id=8523b1e2-b2d5-4f76-b920-8f11cd4f45f0&input_coin_type=hive&input_coin_amount=${steemBalance}&output_coin_type=ltc`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {!isEmpty(user) && !isGuest && ownProfile && (
            <Action big className="WalletSidebar__transfer">
              <FormattedMessage id="exchange" defaultMessage="Exchange" />
            </Action>
          )}
        </a>
        {!isEmpty(user) && ownProfile && isGuest && (
          <Action big className="WalletSidebar__transfer" primary onClick={this.props.openWithdraw}>
            <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
          </Action>
        )}
      </div>
    );
  }
}

export default HiveWalletSidebar;
