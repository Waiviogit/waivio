import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get, isEmpty, isNull } from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import { GUEST_PREFIX } from '../../common/constants/waivio';
import { SBD, STEEM } from '../../common/constants/cryptos';
import { getUserDetailsKey } from '../helpers/stateHelpers';
import UserWalletTransactions from '../wallet/UserWalletTransactions';
import Loading from '../components/Icon/Loading';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getCryptosPriceHistory,
  getGuestUserBalance,
  getLoadingGlobalProperties,
  getLoadingMoreUsersAccountHistory,
  getScreenSize,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUser,
  getUserHasMoreAccountHistory,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersTransactions,
  getPlatformName,
} from '../reducers';
import {
  getGlobalProperties,
  getMoreUserAccountHistory,
  getUserAccountHistory,
} from '../wallet/walletActions';
import { getAccount } from './usersActions';
import { getCrossStatistics } from '../../investarena/redux/actions/platformActions';
import WalletSidebar from '../components/Sidebar/WalletSidebar';

@withRouter
@connect(
  (state, ownProps) => ({
    user:
      ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
        ? getAuthenticatedUser(state)
        : getUser(state, ownProps.match.params.name),
    authenticatedUserName: getAuthenticatedUserName(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    usersTransactions: getUsersTransactions(state),
    usersAccountHistory: getUsersAccountHistory(state),
    usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
    loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
    screenSize: getScreenSize(state),
    userHasMoreActions: getUserHasMoreAccountHistory(
      state,
      ownProps.isCurrentUser
        ? getAuthenticatedUserName(state)
        : getUser(state, ownProps.match.params.name).name,
    ),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    guestBalance: getGuestUserBalance(state),
    platformName: getPlatformName(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getAccount,
    getCrossStatistics,
  },
)
class Wallet extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    usersTransactions: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
    screenSize: PropTypes.string.isRequired,
    guestBalance: PropTypes.number,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
    guestBalance: null,
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersTransactions,
      user,
      isCurrentUser,
      authenticatedUserName,
      platformName,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (platformName === 'beaxy') {
      this.props.getCrossStatistics();
    }

    if (isEmpty(totalVestingFundSteem) || isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (isEmpty(usersTransactions[getUserDetailsKey(username)])) {
      this.props.getUserAccountHistory(username);
    }

    if (isEmpty(user)) {
      this.props.getAccount(username);
    }
  }

  render() {
    const {
      user,
      totalVestingShares,
      totalVestingFundSteem,
      loadingGlobalProperties,
      usersTransactions,
      usersAccountHistoryLoading,
      loadingMoreUsersAccountHistory,
      userHasMoreActions,
      usersAccountHistory,
      cryptosPriceHistory,
      screenSize,
      guestBalance,
    } = this.props;

    const userKey = getUserDetailsKey(user.name);
    const transactions = get(usersTransactions, userKey, []);
    const actions = get(usersAccountHistory, userKey, []);
    const currentSteemRate = get(
      cryptosPriceHistory,
      `${STEEM.symbol}.priceDetails.currentUSDPrice`,
      null,
    );
    const currentSBDRate = get(
      cryptosPriceHistory,
      `${SBD.symbol}.priceDetails.currentUSDPrice`,
      null,
    );
    const steemRateLoading = isNull(currentSteemRate) || isNull(currentSBDRate);

    const isMobile = screenSize === 'xsmall' || screenSize === 'small';

    const isGuest = user.name.startsWith(GUEST_PREFIX);

    const walletTransactions =
      transactions.length === 0 && usersAccountHistoryLoading ? (
        <Loading style={{ marginTop: '20px' }} />
      ) : (
        <UserWalletTransactions
          transactions={transactions}
          actions={actions}
          currentUsername={user.name}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          getMoreUserAccountHistory={this.props.getMoreUserAccountHistory}
          loadingMoreUsersAccountHistory={loadingMoreUsersAccountHistory}
          userHasMoreActions={userHasMoreActions}
        />
      );

    return (
      <div>
        <UserWalletSummary
          user={user}
          balance={isGuest ? guestBalance : user.balance}
          loading={user.fetching}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          loadingGlobalProperties={loadingGlobalProperties}
          steemRate={currentSteemRate}
          sbdRate={currentSBDRate}
          steemRateLoading={steemRateLoading}
          isGuest={isGuest}
        />
        {isMobile && <WalletSidebar />}
        {walletTransactions}
      </div>
    );
  }
}

export default Wallet;
