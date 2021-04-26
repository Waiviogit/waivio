import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import { get, size, isEmpty, filter } from 'lodash';
import moment from 'moment';

import {
  openWalletTable,
  closeWalletTable,
  getUserTableTransactionHistory,
  clearTransactionsTableHistory,
  getMoreTableUserTransactionHistory,
  getMoreUserAccountHistory,
  clearTransactionsHistory,
  getUserAccountHistory,
} from '../../store/walletStore/walletActions';
import {
  getDataDemoTransactions,
  handleLoadMoreTransactions,
  TRANSACTION_TYPES,
} from '../WalletHelper';
import { guestUserRegex } from '../../helpers/regexHelpers';
import TableFilter from './TableFilter';
import WalletTable from './WalletTable';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../store/authStore/authSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import {
  getIsErrorLoadingTable,
  getIsloadingMoreTableTransactions,
  getIsloadingTableTransactions,
  getLoadingMoreUsersAccountHistory,
  getTableOperationNum,
  getTableTransactions,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getTransactions,
  getUserHasMoreTable,
  getUsersAccountHistory,
  getUsersTransactions,
  hasMoreGuestActions,
} from '../../store/walletStore/walletSelectors';
import { getLocale } from '../../store/settingsStore/settingsSelectors';

import './WalletTable.less';

@Form.create()
@injectIntl
@connect(
  (state, ownProps) => ({
    user:
      ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
        ? getAuthenticatedUser(state)
        : getUser(state, ownProps.match.params.name),
    transactionsHistory: getTransactions(state),
    demoTransactionsHistory: getUsersTransactions(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    tableTransactionsHistory: getTableTransactions(state),
    hasMore: getUserHasMoreTable(state),
    operationNum: getTableOperationNum(state),
    isloadingMoreTableTransactions: getIsloadingMoreTableTransactions(state),
    isloadingMoreDemoTransactions: getLoadingMoreUsersAccountHistory(state),
    usersAccountHistory: getUsersAccountHistory(state),
    demoHasMoreActions: hasMoreGuestActions(state),
    isErrorLoading: getIsErrorLoadingTable(state),
    isloadingTableTransactions: getIsloadingTableTransactions(state),
    locale: getLocale(state),
  }),
  {
    openTable: openWalletTable,
    closeTable: closeWalletTable,
    getTransactionsByInterval: getUserTableTransactionHistory,
    getDemoTransactionsByInterval: getUserAccountHistory,
    clearTable: clearTransactionsTableHistory,
    clearWalletHistory: clearTransactionsHistory,
    getMoreTableTransactions: getMoreTableUserTransactionHistory,
    getMoreDemoTransactions: getMoreUserAccountHistory,
  },
)
class WalletTableContainer extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    operationNum: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    openTable: PropTypes.func,
    closeTable: PropTypes.func,
    getTransactionsByInterval: PropTypes.func,
    getDemoTransactionsByInterval: PropTypes.func,
    hasMore: PropTypes.bool,
    demoHasMoreActions: PropTypes.bool,
    clearTable: PropTypes.func,
    getMoreTableTransactions: PropTypes.func,
    getMoreDemoTransactions: PropTypes.func,
    isloadingMoreTableTransactions: PropTypes.bool,
    isloadingMoreDemoTransactions: PropTypes.bool,
    usersAccountHistory: PropTypes.shape(),
    tableTransactionsHistory: PropTypes.shape(),
    clearWalletHistory: PropTypes.func,
    transactionsHistory: PropTypes.shape(),
    demoTransactionsHistory: PropTypes.shape(),
    form: PropTypes.shape().isRequired,
    isErrorLoading: PropTypes.bool,
    isloadingTableTransactions: PropTypes.bool,
    locale: PropTypes.string.isRequired,
    history: PropTypes.shape(),
  };

  static defaultProps = {
    openTable: () => {},
    closeTable: () => {},
    getTransactionsByInterval: () => {},
    getDemoTransactionsByInterval: () => {},
    clearTable: () => {},
    getMoreTableTransactions: () => {},
    getMoreDemoTransactions: () => {},
    clearWalletHistory: () => {},
    transactionsHistory: {},
    demoTransactionsHistory: {},
    hasMore: false,
    demoHasMoreActions: false,
    isloadingMoreTableTransactions: false,
    isloadingMoreDemoTransactions: false,
    usersAccountHistory: {},
    tableTransactionsHistory: {},
    isSubmitLoading: false,
    operationNum: -1,
    isErrorLoading: false,
    isloadingTableTransactions: false,
    history: {},
    user: {},
  };

  state = {
    startDate: 0,
    endDate: 0,
    isEmptyPeriod: true,
  };

  componentDidMount() {
    this.props.openTable();
  }

  componentWillUnmount() {
    this.props.closeTable();
  }

  getCurrentTransactions = (isGuestPage, tableTransactionsHistory) => {
    const { user, transactionsHistory, demoTransactionsHistory } = this.props;
    const username = user.name;

    if (!isGuestPage && !size(transactionsHistory)) {
      return get(tableTransactionsHistory, username, []);
    }
    if (isGuestPage) {
      return getDataDemoTransactions(username, demoTransactionsHistory);
    }

    return get(transactionsHistory, username, []);
  };

  handleRequestResultMessage = (startDate, endDate) => {
    if (startDate === 0 && endDate === 0) {
      this.setState({ isEmptyPeriod: true });
    } else {
      this.setState({ isEmptyPeriod: false });
    }
  };

  handleSubmit = () => {
    const {
      getTransactionsByInterval,
      getDemoTransactionsByInterval,
      clearTable,
      clearWalletHistory,
      user,
    } = this.props;
    const { startDate, endDate } = this.state;
    const currentUsername = user.name;
    const isGuestPage = guestUserRegex.test(user && user.name);
    const tableView = true;
    const limit = 10;

    clearWalletHistory();

    if (isGuestPage) {
      getDemoTransactionsByInterval(currentUsername, tableView, startDate, endDate).then(() => {
        this.handleRequestResultMessage(startDate, endDate);
      });
    } else {
      clearTable();
      getTransactionsByInterval(
        currentUsername,
        limit,
        tableView,
        startDate,
        endDate,
        TRANSACTION_TYPES,
      ).then(() => this.handleRequestResultMessage(startDate, endDate));
    }
  };

  handleOnClick = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      err => !err && setTimeout(() => this.handleSubmit(), 500),
    );
  };

  handleLoadMore = () => {
    const currentUsername = get(this.props.user, 'name', '');
    const isGuestPage = guestUserRegex.test(currentUsername);
    const actions = get(this.props.usersAccountHistory, currentUsername, []);

    const loadMoreValues = {
      username: currentUsername,
      operationNumber: this.props.operationNum,
      isLoadingMore: this.props.isloadingMoreTableTransactions,
      demoIsLoadingMore: this.props.isloadingMoreDemoTransactions,
      getMoreFunction: this.props.getMoreTableTransactions,
      getMoreDemoFunction: this.props.getMoreDemoTransactions,
      transferActions: actions,
      isGuest: isGuestPage,
      table: true,
      fromDate: this.state.startDate,
      tillDate: this.state.endDate,
      types: TRANSACTION_TYPES,
    };

    return handleLoadMoreTransactions(loadMoreValues);
  };

  selectRenderElements = (intl, transactions, isGuestPage, currentUsername) => {
    const {
      demoHasMoreActions,
      hasMore,
      isErrorLoading,
      totalVestingShares,
      totalVestingFundSteem,
    } = this.props;

    const filteredTransacions = filter(transactions, transaction =>
      transaction.type === 'transfer' && transaction.from === transaction.to ? null : transaction,
    );

    if (
      (!this.state.isEmptyPeriod && !isEmpty(filteredTransacions)) ||
      (this.state.isEmptyPeriod && !isEmpty(filteredTransacions))
    ) {
      return (
        <WalletTable
          intl={intl}
          handleLoadMore={this.handleLoadMore}
          hasMore={isGuestPage ? demoHasMoreActions : hasMore}
          isErrorLoading={isErrorLoading}
          transactions={transactions}
          currentUsername={currentUsername}
          totalVestingShares={totalVestingShares}
          totalVestingFundSteem={totalVestingFundSteem}
        />
      );
    } else if (!this.state.isEmptyPeriod && isEmpty(filteredTransacions)) {
      return (
        <div className="WalletTable__empty-table">
          {intl.formatMessage({
            id: 'empty_table_transaction_list',
            defaultMessage: `You did not have any transactions during this period`,
          })}
        </div>
      );
    }

    return (
      <div className="WalletTable__empty-table">
        {intl.formatMessage({
          id: 'empty_table',
          defaultMessage: `Please, select start and end date`,
        })}
      </div>
    );
  };

  render() {
    const {
      user,
      intl,
      tableTransactionsHistory,
      isloadingTableTransactions,
      locale,
      history,
      form,
    } = this.props;
    const currentUsername = get(user, 'name', '');
    const isGuestPage = guestUserRegex.test(currentUsername);
    const transactions = this.getCurrentTransactions(isGuestPage, tableTransactionsHistory);

    return (
      <React.Fragment>
        <TableFilter
          intl={intl}
          isloadingTableTransactions={isloadingTableTransactions}
          locale={locale}
          history={history}
          user={user}
          getFieldDecorator={form.getFieldDecorator}
          handleOnClick={this.handleOnClick}
          changeEndDate={value => {
            const date = moment(value);
            const isToday =
              date.startOf('day').unix() ===
              moment()
                .startOf('day')
                .unix();
            const endDate = isToday ? moment().unix() : date.endOf('day').unix();

            this.setState({ endDate });
          }}
          changeStartDate={value =>
            this.setState({
              startDate: moment(value)
                .startOf('day')
                .unix(),
            })
          }
        />
        {this.selectRenderElements(intl, transactions, isGuestPage, currentUsername)}
      </React.Fragment>
    );
  }
}

export default WalletTableContainer;
