import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { get, isEmpty } from 'lodash';
import UserWalletSummary from '../wallet/UserWalletSummary';
import { HBD, HIVE } from '../../common/constants/cryptos';
import UserWalletTransactions from '../wallet/UserWalletTransactions';
import Loading from '../components/Icon/Loading';
import {
  getMoreUserAccountHistory,
  getUserTransactionHistory,
  getMoreUserTransactionHistory,
  getUserAccountHistory,
  clearTransactionsHistory,
} from '../../store/walletStore/walletActions';
import { guestUserRegex } from '../helpers/regexHelpers';
import Withdraw from '../wallet/Withdraw/WithDraw';
import { getCryptosPriceHistory, getScreenSize } from '../../store/appStore/appSelectors';

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
} from '../../store/walletStore/walletSelectors';

import './UserWallet.less';

@injectIntl
@withRouter
@connect(
  state => ({
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
    getMoreUserAccountHistory,
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
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    cryptosPriceHistory: PropTypes.shape().isRequired,
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    demoHasMoreActions: PropTypes.bool.isRequired,
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
    const { transactionsHistory } = this.props;
    const username = this.props.match.params.name;
    const isGuest = guestUserRegex.test(username);

    if (!isGuest && isEmpty(transactionsHistory[username])) {
      this.props.getUserTransactionHistory(username);
    }

    this.props.getUserAccountHistory(username);
  }

  componentWillUnmount() {
    if (
      this.props.history.location.pathname !== `/@${this.props.match.params.name}/transfers/table`
    ) {
      this.props.clearTransactionsHistory();
    }
  }

  tableButton = () => (
    <span
      className="UserWallet__view-btn"
      role="presentation"
      onClick={() => this.props.history.push(`/@${this.props.match.params.name}/transfers/table`)}
    >
      {this.props.intl.formatMessage({
        id: 'table_view',
        defaultMessage: 'Advanced reports',
      })}
    </span>
  );

  handleRenderWalletTransactions = (
    transactions,
    demoTransactions,
    isEmptyTransactions,
    actions,
    isMobile,
  ) => {
    const {
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
          user={this.props.match.params.name}
          getMoreUserTransactionHistory={this.props.getMoreUserTransactionHistory}
          transactions={transactions}
          hasMore={hasMore}
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
      totalVestingShares,
      totalVestingFundSteem,
      loadingGlobalProperties,
      cryptosPriceHistory,
      screenSize,
      transactionsHistory,
      usersTransactions,
      usersAccountHistory,
    } = this.props;
    const userKey = this.props.match.params.name;
    const isGuest = guestUserRegex.test(userKey);
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
    const isMobile = screenSize === 'xsmall' || screenSize === 'small';

    return (
      <div>
        <UserWalletSummary
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
          loadingGlobalProperties={loadingGlobalProperties}
          steemRate={currentSteemRate}
          sbdRate={currentSBDRate}
          userName={this.props.match.params.name}
        />
        {!isEmptyTransactions && this.tableButton(isEmptyTransactions)}
        {this.handleRenderWalletTransactions(
          transactions,
          demoTransactions,
          isEmptyTransactions,
          actions,
          isMobile,
        )}
        {this.props.isWithdrawOpen && <Withdraw />}
      </div>
    );
  }
}

export default Wallet;
