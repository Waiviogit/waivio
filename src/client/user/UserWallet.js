import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get, isEmpty, isNull, sortBy } from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import { guestUserRegex } from '../helpers/regexHelpers';
import { HBD, HIVE } from '../../common/constants/cryptos';
import { getUserDetailsKey } from '../helpers/stateHelpers';
import UserWalletTransactions from '../wallet/UserWalletTransactions';
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
  getBeaxyWallet,
  getCurrenciesDescriptions,
  isGuestBalance,
  isGuestUser,
} from '../reducers';
import {
  getGlobalProperties,
  getMoreUserAccountHistory,
  getUserAccountHistory,
} from '../wallet/walletActions';
import { getAccount } from './usersActions';
import WalletSidebar from '../components/Sidebar/WalletSidebar';
import UserDynamicListLoading from './UserDynamicListLoading';

const initWalletsQuantity = 5;

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
    beaxyBalance:
      ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
        ? getBeaxyWallet(state)
        : [],
    currenciesDescriptions: getCurrenciesDescriptions(state),
    ownGuestBalance: isGuestBalance(state),
    isGuest: isGuestUser(state),
    ownPage:
      ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getAccount,
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
    beaxyBalance: PropTypes.arrayOf(PropTypes.shape()),
    ownGuestBalance: PropTypes.func,
    isGuest: PropTypes.bool,
    ownPage: PropTypes.bool,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
    guestBalance: null,
    platformName: '',
    beaxyBalance: [],
    currenciesDescriptions: {},
    ownGuestBalance: null,
    isGuest: false,
    ownPage: false,
  };

  state = {
    isShowMoreBeaxy: false,
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersTransactions,
      user,
      isCurrentUser,
      authenticatedUserName,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

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

  getBeaxyBalance = () => {
    const { beaxyBalance } = this.props;
    const { isShowMoreBeaxy } = this.state;
    const sortedBalance = sortBy(beaxyBalance, 'value').reverse();
    if (!isShowMoreBeaxy) {
      const positiveBalances = sortedBalance.filter(item => item.balance > 0);
      return positiveBalances.length
        ? positiveBalances
        : sortedBalance.slice(0, initWalletsQuantity);
    }
    return sortedBalance;
  };

  showMoreToggler = () => {
    this.setState({ isShowMoreBeaxy: !this.state.isShowMoreBeaxy });
  };

  selectUserBalance = () => {
    const { user, ownGuestBalance, guestBalance, isGuest, ownPage } = this.props;

    const isGuestWalletPage = guestUserRegex.test(user && user.name);

    if (ownPage && isGuest) {
      return ownGuestBalance;
    } else if (isGuestWalletPage && !ownPage) {
      return guestBalance;
    } else if (!isGuestWalletPage) {
      return user.balance;
    }
    return null;
  };

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
    } = this.props;

    const { isShowMoreBeaxy } = this.state;
    const userKey = getUserDetailsKey(user.name);
    const transactions = get(usersTransactions, userKey, []);
    const actions = get(usersAccountHistory, userKey, []);
    const currentSteemRate = get(
      cryptosPriceHistory,
      `${HIVE.coinGeckoId}.usdPriceHistory.usd`,
      null,
    );
    const beaxyBalance = this.getBeaxyBalance();

    const isZeroBalancesOnly = this.props.beaxyBalance.every(item => item.balance === 0);

    const currentSBDRate = get(cryptosPriceHistory, `${HBD.coinGeckoId}.usdPriceHistory.usd`, null);

    const steemRateLoading = isNull(currentSteemRate) || isNull(currentSBDRate);

    const isMobile = screenSize === 'xsmall' || screenSize === 'small';

    const isGuest = guestUserRegex.test(user && user.name);

    const walletTransactions =
      transactions.length === 0 && usersAccountHistoryLoading ? (
        <UserDynamicListLoading />
      ) : (
        <UserWalletTransactions
          isGuestUser={isGuest}
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
          balance={this.selectUserBalance()}
          beaxyBalance={beaxyBalance}
          isShowMore={isShowMoreBeaxy}
          hasMoreBalances={
            !isZeroBalancesOnly || this.props.beaxyBalance.length > initWalletsQuantity
          }
          showMore={this.showMoreToggler}
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
