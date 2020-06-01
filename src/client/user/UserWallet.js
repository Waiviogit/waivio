import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { get, isEmpty, isNull } from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import { HBD, HIVE } from '../../common/constants/cryptos';
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
  getTransactions,
  getUser,
  getUserHasMore,
  getUserHasMoreAccountHistory,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersTransactions,
  isGuestBalance,
  isGuestUser,
} from '../reducers';
import {
  getGlobalProperties,
  getMoreUserAccountHistory,
  getUserTransactionHistory,
  getMoreUserTransactionHistory,
  getUserAccountHistory,
} from '../wallet/walletActions';
import { getAccount } from './usersActions';
import WalletSidebar from '../components/Sidebar/WalletSidebar';
import { getUserDetailsKey } from '../helpers/stateHelpers';
import { guestUserRegex } from '../helpers/regexHelpers';

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
    usersAccountHistory: getUsersAccountHistory(state),
    usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
    loadingMoreUsersAccountHistory: getLoadingMoreUsersAccountHistory(state),
    screenSize: getScreenSize(state),
    demoHasMoreActions: getUserHasMoreAccountHistory(
      state,
      ownProps.isCurrentUser
        ? getAuthenticatedUserName(state)
        : getUser(state, ownProps.match.params.name).name,
    ),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    guestBalance: getGuestUserBalance(state),
    usersTransactions: getUsersTransactions(state),
    transactionsHistory: getTransactions(state),
    hasMore: getUserHasMore(state),
    ownGuestBalance: isGuestBalance(state),
    isGuest: isGuestUser(state),
    ownPage:
      ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state),
  }),
  {
    getGlobalProperties,
    getMoreUserAccountHistory,
    getAccount,
    getUserTransactionHistory,
    getMoreUserTransactionHistory,
    getUserAccountHistory,
  },
)
class Wallet extends Component {
  static propTypes = {
    location: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    getAccount: PropTypes.func.isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    demoHasMoreActions: PropTypes.bool.isRequired,
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
    screenSize: PropTypes.string.isRequired,
    guestBalance: PropTypes.number,
    transactionsHistory: PropTypes.arrayOf(PropTypes.shape()),
    getUserTransactionHistory: PropTypes.func.isRequired,
    getMoreUserTransactionHistory: PropTypes.func,
    hasMore: PropTypes.bool,
    ownGuestBalance: PropTypes.number,
    isGuest: PropTypes.bool,
    ownPage: PropTypes.bool,
    usersTransactions: PropTypes.shape().isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
    guestBalance: null,
    usersTransactions: [],
    transactionsHistory: {},
    hasMore: false,
    getMoreUserTransactionHistory: () => {},
    ownGuestBalance: null,
    isGuest: false,
    ownPage: false,
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      user,
      isCurrentUser,
      authenticatedUserName,
      transactionsHistory,
      usersTransactions,
    } = this.props;

    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (isEmpty(totalVestingFundSteem) || isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (isEmpty(user)) {
      this.props.getAccount(username);
    }

    if (isEmpty(usersTransactions[getUserDetailsKey(username)])) {
      this.props.getUserAccountHistory(username);
    }

    if (isEmpty(transactionsHistory[getUserDetailsKey(username)])) {
      this.props.getUserTransactionHistory(username);
    }
  }

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
      usersAccountHistoryLoading,
      loadingMoreUsersAccountHistory,
      demoHasMoreActions,
      cryptosPriceHistory,
      screenSize,
      transactionsHistory,
      hasMore,
      usersTransactions,
      usersAccountHistory,
    } = this.props;

    const userKey = getUserDetailsKey(user.name);
    const demoTransactions = get(usersTransactions, userKey, []);
    const actions = get(usersAccountHistory, userKey, []);
    const transactions = get(transactionsHistory, userKey, []);

    const currentSteemRate = get(
      cryptosPriceHistory,
      `${HIVE.coinGeckoId}.usdPriceHistory.usd`,
      null,
    );
    const currentSBDRate = get(cryptosPriceHistory, `${HBD.coinGeckoId}.usdPriceHistory.usd`, null);
    const steemRateLoading = isNull(currentSteemRate) || isNull(currentSBDRate);

    const isMobile = screenSize === 'xsmall' || screenSize === 'small';

    const isGuest = guestUserRegex.test(user && user.name);

    const walletTransactions = usersAccountHistoryLoading ? (
      <Loading style={{ marginTop: '20px' }} />
    ) : (
      <UserWalletTransactions
        user={user}
        getMoreUserTransactionHistory={this.props.getMoreUserTransactionHistory}
        transactions={transactions}
        hasMore={hasMore}
        currentUsername={user.name}
        totalVestingShares={totalVestingShares}
        totalVestingFundSteem={totalVestingFundSteem}
        getMoreUserAccountHistory={this.props.getMoreUserAccountHistory}
        loadingMoreUsersAccountHistory={loadingMoreUsersAccountHistory}
        demoTransactions={demoTransactions}
        demoHasMoreActions={demoHasMoreActions}
        actions={actions}
      />
    );

    return (
      <div>
        <UserWalletSummary
          user={user}
          balance={this.selectUserBalance()}
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
