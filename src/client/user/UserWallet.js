import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, isEmpty, isNull } from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import { HBD, HIVE } from '../../common/constants/cryptos';
import UserWalletTransactions from '../wallet/UserWalletTransactions';
import Loading from '../components/Icon/Loading';
import {
  getGlobalProperties,
  getMoreUserAccountHistory,
  getUserTransactionHistory,
  getMoreUserTransactionHistory,
  getUserAccountHistory,
  clearTransactionsHistory,
} from '../store/walletStore/walletActions';
import { getUserAccount } from '../store/usersStore/usersActions';
import WalletSidebar from '../components/Sidebar/WalletSidebar';
import { guestUserRegex } from '../helpers/regexHelpers';
import Transfer from '../wallet/Transfer/Transfer';
import Withdraw from '../wallet/Withdraw/WithDraw';
import PowerUpOrDown from '../wallet/PowerUpOrDown';
import { getCryptosPriceHistory, getScreenSize } from '../store/appStore/appSelectors';
import { getAuthenticatedUser, getAuthenticatedUserName } from '../store/authStore/authSelectors';
import { getUser } from '../store/usersStore/usersSelectors';
import {
  getIsErrorLoading,
  getIsloadingMoreTransactions,
  getIsTransactionsHistoryLoading,
  getLoadingGlobalProperties,
  getLoadingMoreUsersAccountHistory,
  getOperationNum,
  getStatusWithdraw,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getTransactions,
  getUserHasMore,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersTransactions,
  hasMoreGuestActions,
} from '../store/walletStore/walletSelectors';

import './UserWallet.less';

@injectIntl
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
    demoHasMoreActions: hasMoreGuestActions(state),
    cryptosPriceHistory: getCryptosPriceHistory(state),
    usersTransactions: getUsersTransactions(state),
    transactionsHistory: getTransactions(state),
    hasMore: getUserHasMore(state),
    isErrorLoading: getIsErrorLoading(state),
    operationNum: getOperationNum(state),
    isloadingMoreTransactions: getIsloadingMoreTransactions(state),
    isloadingMoreDemoTransactions: getLoadingMoreUsersAccountHistory(state),
    isWithdrawOpen: getStatusWithdraw(state),
    isTransactionsHistoryLoading: getIsTransactionsHistoryLoading(state),
  }),
  {
    getGlobalProperties,
    getMoreUserAccountHistory,
    getUserAccount,
    getUserTransactionHistory,
    getMoreUserTransactionHistory,
    getUserAccountHistory,
    clearTransactionsHistory,
  },
)
class Wallet extends Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    user: PropTypes.shape().isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    getUserAccount: PropTypes.func.isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    demoHasMoreActions: PropTypes.bool.isRequired,
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
    screenSize: PropTypes.string.isRequired,
    transactionsHistory: PropTypes.shape(),
    getUserTransactionHistory: PropTypes.func.isRequired,
    getMoreUserTransactionHistory: PropTypes.func,
    hasMore: PropTypes.bool,
    usersTransactions: PropTypes.shape().isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    isErrorLoading: PropTypes.bool,
    operationNum: PropTypes.number,
    isloadingMoreTransactions: PropTypes.bool,
    isloadingMoreDemoTransactions: PropTypes.bool,
    clearTransactionsHistory: PropTypes.func,
    isWithdrawOpen: PropTypes.bool,
    history: PropTypes.shape(),
    match: PropTypes.shape().isRequired,
    isTransactionsHistoryLoading: PropTypes.bool,
  };

  static defaultProps = {
    isCurrentUser: false,
    authenticatedUserName: '',
    usersTransactions: [],
    transactionsHistory: {},
    hasMore: false,
    getMoreUserTransactionHistory: () => {},
    ownPage: false,
    isErrorLoading: false,
    operationNum: -1,
    isloadingMoreTransactions: false,
    isloadingMoreDemoTransactions: false,
    clearTransactionsHistory: () => {},
    isWithdrawOpen: false,
    history: {},
    isTransactionsHistoryLoading: false,
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      user,
      isCurrentUser,
      authenticatedUserName,
      transactionsHistory,
    } = this.props;

    const isGuest = guestUserRegex.test(user && user.name);

    const username = isCurrentUser ? authenticatedUserName : this.props.match.params.name;

    if (isEmpty(totalVestingFundSteem) || isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (isEmpty(user)) {
      this.props.getUserAccount(username);
    }

    if (!isGuest && isEmpty(transactionsHistory[username])) {
      this.props.getUserTransactionHistory(username);
    }

    this.props.getUserAccountHistory(username);
  }

  componentWillUnmount() {
    const { isCurrentUser, authenticatedUserName, history } = this.props;
    const username = isCurrentUser ? authenticatedUserName : this.props.match.params.name;

    if (history.location.pathname !== `/@${username}/transfers/table`) {
      this.props.clearTransactionsHistory();
    }
  }

  tableButton = () => {
    const { intl, user } = this.props;

    return (
      <span
        className="UserWallet__view-btn"
        role="presentation"
        onClick={() => this.props.history.push(`/@${user.name}/transfers/table`)}
      >
        {intl.formatMessage({
          id: 'table_view',
          defaultMessage: 'Advanced reports',
        })}
      </span>
    );
  };

  handleRenderWalletTransactions = (
    transactions,
    demoTransactions,
    isEmptyTransactions,
    actions,
    isMobile,
  ) => {
    const {
      user,
      usersAccountHistoryLoading,
      isTransactionsHistoryLoading,
      hasMore,
      totalVestingShares,
      totalVestingFundSteem,
      loadingMoreUsersAccountHistory,
      demoHasMoreActions,
      isErrorLoading,
      operationNum,
      isloadingMoreTransactions,
      isloadingMoreDemoTransactions,
    } = this.props;

    if (usersAccountHistoryLoading || isTransactionsHistoryLoading) {
      return <Loading style={{ marginTop: '20px' }} />;
    }
    if (!isEmptyTransactions) {
      return (
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
          isErrorLoading={isErrorLoading}
          operationNum={operationNum}
          isloadingMoreTransactions={isloadingMoreTransactions}
          isloadingMoreDemoTransactions={isloadingMoreDemoTransactions}
          isMobile={isMobile}
        />
      );
    }

    return (
      <div className="UserWallet__empty-transactions-list">
        <FormattedMessage
          id="empty_transaction_list"
          defaultMessage="You don't have any transactions yet"
        />
      </div>
    );
  };

  render() {
    const {
      user,
      totalVestingShares,
      totalVestingFundSteem,
      loadingGlobalProperties,
      cryptosPriceHistory,
      screenSize,
      transactionsHistory,
      usersTransactions,
      usersAccountHistory,
    } = this.props;
    const isGuest = guestUserRegex.test(user && user.name);
    const userKey = user.name;
    const demoTransactions = get(usersTransactions, userKey, []);
    const actions = get(usersAccountHistory, userKey, []);
    const transactions = get(transactionsHistory, userKey, []);
    const isEmptyTransactions =
      (isGuest && isEmpty(demoTransactions)) || (!isGuest && isEmpty(transactions));

    const currentSteemRate = get(
      cryptosPriceHistory,
      `${HIVE.coinGeckoId}.usdPriceHistory.usd`,
      null,
    );
    const currentSBDRate = get(cryptosPriceHistory, `${HBD.coinGeckoId}.usdPriceHistory.usd`, null);
    const steemRateLoading = isNull(currentSteemRate) || isNull(currentSBDRate);

    const isMobile = screenSize === 'xsmall' || screenSize === 'small';

    return (
      <div>
        <UserWalletSummary
          user={user}
          loading={user.fetching}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          loadingGlobalProperties={loadingGlobalProperties}
          steemRate={currentSteemRate}
          sbdRate={currentSBDRate}
          steemRateLoading={steemRateLoading}
          isGuest={isGuest}
        />
        {!isEmptyTransactions && this.tableButton(isEmptyTransactions)}
        {isMobile && <WalletSidebar />}
        {this.handleRenderWalletTransactions(
          transactions,
          demoTransactions,
          isEmptyTransactions,
          actions,
          isMobile,
        )}
        <Transfer history={this.props.history} />
        <PowerUpOrDown />
        {this.props.isWithdrawOpen && <Withdraw />}
      </div>
    );
  }
}

export default Wallet;
