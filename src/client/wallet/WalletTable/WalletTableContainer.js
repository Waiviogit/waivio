import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { injectIntl } from 'react-intl';
import { get, size, isEmpty, filter, round } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

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
  getCurrentDeposits,
  getCurrentWithdrawals,
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
    deposits: getCurrentDeposits(state),
    withdrawals: getCurrentWithdrawals(state),
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
    deposits: PropTypes.number,
    withdrawals: PropTypes.number,
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
    deposits: 0,
    withdrawals: 0,
  };

  state = {
    startDate: 0,
    endDate: 0,
    isEmptyPeriod: true,
    filterAccounts: [],
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

  // createSubmit = () => {
  //   const i = this.state.filterAccounts.map(user => this.handleSubmitUser(user));
  // }

  handleSubmit = () => {
    const {
      getTransactionsByInterval,
      getDemoTransactionsByInterval,
      clearTable,
      clearWalletHistory,
      user,
    } = this.props;
    const { startDate, endDate, filterAccounts } = this.state;
    const currentUsername = user.name;
    const isGuestPage = guestUserRegex.test(currentUsername);
    const tableView = true;
    const limit = 10;

    clearWalletHistory();

    if (isGuestPage) {
      return getDemoTransactionsByInterval(currentUsername, tableView, startDate, endDate).then(
        () => {
          this.handleRequestResultMessage(startDate, endDate);
        },
      );
    }
    clearTable();

    return getTransactionsByInterval(
      currentUsername,
      limit,
      tableView,
      TRANSACTION_TYPES,
      startDate,
      endDate,
      filterAccounts,
    ).then(() => this.handleRequestResultMessage(startDate, endDate));
  };

  handleOnClick = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(
      err => !err && setTimeout(() => this.handleSubmit(), 500),
    );
  };

  // handleSubmit = () => {
  //   Promise.allSettled(this.createSubmit()).then(r => console.log(r))
  // }

  deleteUserFromFilterAccounts = user => {
    this.setState(preState => ({
      filterAccounts: preState.filterAccounts.filter(acc => acc !== user),
    }));
  };

  handleSelectUserFilterAccounts = user =>
    this.setState(preState => ({
      filterAccounts: [...preState.filterAccounts, user.account],
    }));

  handleLoadMore = () => {
    const username = get(this.props.user, 'name', '');
    const isGuestPage = guestUserRegex.test(username);
    const actions = get(this.props.usersAccountHistory, username, []);
    const { startDate, endDate, filterAccounts } = this.state;
    let skip = 0;
    const limit = 10;
    const transferActionsLength = size(actions);

    if (isGuestPage) {
      if (transferActionsLength >= limit) {
        skip = transferActionsLength;
      }
      if (!this.props.isloadingMoreDemoTransactions) {
        this.props.getMoreDemoTransactions(username, skip, limit);
      }
    }

    if (!isGuestPage && !this.props.isloadingMoreTableTransactions) {
      this.props.getMoreTableTransactions({
        username,
        limit,
        tableView: true,
        startDate,
        endDate,
        types: TRANSACTION_TYPES,
        operationNum: this.props.operationNum,
        filterAccounts,
      });
    }

    if (!isGuestPage && !this.props.isloadingMoreTableTransactions) {
      this.props.getMoreTableTransactions({
        username,
        limit,
        operationNum: this.props.operationNum,
        filterAccounts,
      });
    }
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
        <Link to={`/@${user.name}/transfers`} className="WalletTable__back-btn">
          {intl.formatMessage({
            id: 'table_back',
            defaultMessage: 'Back',
          })}
        </Link>
        <h3>
          {intl.formatMessage({
            id: 'table_view',
            defaultMessage: 'Advanced reports',
          })}
        </h3>
        <TableFilter
          intl={intl}
          isloadingTableTransactions={isloadingTableTransactions}
          filterUsersList={this.state.filterAccounts}
          locale={locale}
          history={history}
          user={user}
          getFieldDecorator={form.getFieldDecorator}
          handleOnClick={this.handleOnClick}
          handleSelectUser={this.handleSelectUserFilterAccounts}
          deleteUser={this.deleteUserFromFilterAccounts}
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
        <div className="WalletTable__total">
          {intl.formatMessage({
            id: 'total',
            defaultMessage: 'TOTAL',
          })}
          :{' '}
          {intl.formatMessage({
            id: 'Deposits',
            defaultMessage: 'Deposits',
          })}
          : <b>${round(this.props.deposits, 3)}</b>.{' '}
          {intl.formatMessage({
            id: 'Withdrawals',
            defaultMessage: 'Withdrawals',
          })}
          : <b>${round(this.props.withdrawals, 3)}</b>.
        </div>
        {this.selectRenderElements(intl, transactions, isGuestPage, currentUsername)}
      </React.Fragment>
    );
  }
}

export default WalletTableContainer;
