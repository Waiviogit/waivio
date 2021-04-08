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
} from '../../store/walletStore/walletActions';
import { HIVE, HBD } from '../../../common/constants/cryptos';
import Action from '../Button/Action';
import ClaimRewardsBlock from '../../wallet/ClaimRewardsBlock';
import CryptoTrendingCharts from './CryptoTrendingCharts';
import { openLinkHiveAccountModal } from '../../store/settingsStore/settingsActions';
import { getCryptosPriceHistory } from '../../store/appStore/appSelectors';
import { getAuthenticatedUser, isGuestUser } from '../../store/authStore/authSelectors';
import { getHiveBeneficiaryAccount } from '../../store/settingsStore/settingsSelectors';

import './WalletSidebar.less';

@withRouter
@connect(
  state => ({
    isGuest: isGuestUser(state),
    user: getAuthenticatedUser(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
  }),
  {
    openTransfer,
    openPowerUpOrDown,
    openWithdraw,
    openLinkHiveAccountModal,
  },
)
class WalletSidebar extends React.Component {
  static propTypes = {
    user: PropTypes.shape(),
    isCurrentUser: PropTypes.bool,
    match: PropTypes.shape().isRequired,
    openTransfer: PropTypes.func.isRequired,
    openPowerUpOrDown: PropTypes.func.isRequired,
    cryptosPriceHistory: PropTypes.shape(),
    isGuest: PropTypes.bool,
    openWithdraw: PropTypes.func.isRequired,
    openLinkHiveAccountModal: PropTypes.func.isRequired,
    hiveBeneficiaryAccount: PropTypes.string,
  };

  static defaultProps = {
    user: {},
    isCurrentUser: false,
    cryptosPriceHistory: {},
    isGuest: false,
    hiveBeneficiaryAccount: '',
  };

  handleOpenTransfer = () => {
    const { match, user, isCurrentUser, hiveBeneficiaryAccount, isGuest } = this.props;
    const username = match.params.name === user.name || isCurrentUser ? '' : match.params.name;

    if (!hiveBeneficiaryAccount && isGuest) this.props.openLinkHiveAccountModal(true);
    this.props.openTransfer(username);
  };

  handleOpenPowerUp = () => {
    this.props.openPowerUpOrDown();
  };

  handleOpenPowerDown = () => {
    this.props.openPowerUpOrDown(true);
  };

  handleChartsLoading = () => {};

  render() {
    const { match, user, isCurrentUser, cryptosPriceHistory, isGuest } = this.props;
    const ownProfile = match.params.name === user.name || isCurrentUser;
    const cryptos = [HIVE.symbol, HBD.symbol];
    const steemBalance = user.balance ? String(user.balance).match(/^[\d.]+/g)[0] : 0;

    return (
      <div className="WalletSidebar">
        <Action big className="WalletSidebar__transfer" primary onClick={this.handleOpenTransfer}>
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
        {!isEmpty(cryptosPriceHistory) && <CryptoTrendingCharts cryptos={cryptos} />}
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

export default WalletSidebar;
