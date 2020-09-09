import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, DatePicker, Form } from 'antd';
import { injectIntl } from 'react-intl';
import { get, map, size } from 'lodash';
import moment from 'moment';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getTableOperationNum,
  getTableTransactions,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getTransactions,
  getUser,
  getUserHasMoreTable,
  getUsersTransactions,
  getIsloadingMoreTableTransactions,
  getLoadingMoreUsersAccountHistory,
  getUsersAccountHistory,
  hasMoreGuestActions,
} from '../reducers';
import {
  openWalletTable,
  closeWalletTable,
  getUserTableTransactionHistory,
  clearTransactionsTableHistory,
  getMoreTableUserTransactionHistory,
  getMoreUserAccountHistory,
  clearTransactionsHistory,
  getUserAccountHistory,
} from './walletActions';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import WalletTableBodyRow from './WalletTableBodyRow';
import {
  getDataDemoTransactions,
  handleLoadMoreTransactions,
  TRANSACTION_TYPES,
} from './WalletHelper';
import { guestUserRegex } from '../helpers/regexHelpers';

import './WalletTable.less';

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
class WalletTable extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    operationNum: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
    }).isRequired,
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
  };

  state = {
    startDate: 0,
    endDate: 0,
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

  handleSubmit = (currentUsername, isGuestPage, tableView) => {
    // operationNum, // Todo отправлять после фиксов с бэка. Неправильная фильтрация
    const { getTransactionsByInterval, getDemoTransactionsByInterval, clearTable } = this.props;
    const { startDate, endDate } = this.state;
    const limit = 10;

    if (isGuestPage) {
      getDemoTransactionsByInterval(currentUsername, tableView, startDate, endDate);
    } else {
      clearTable();
      getTransactionsByInterval(
        currentUsername,
        limit,
        tableView,
        startDate,
        endDate,
        TRANSACTION_TYPES,
      );
    }
  };

  filterPanel = (currentUsername, tableView, isGuestPage) => {
    const { intl, clearWalletHistory } = this.props;
    return (
      <Form layout="vertical">
        <Form.Item>
          {intl.formatMessage({
            id: 'table_date_from',
            defaultMessage: 'From:',
          })}
          <DatePicker
            placeholder={intl.formatMessage({
              id: 'table_date_picker',
              defaultMessage: 'Select date and time',
            })}
            onChange={value => this.setState({ startDate: moment(value).unix() })}
          />
          {intl.formatMessage({
            id: 'table_date_till',
            defaultMessage: 'Till:',
          })}
          <DatePicker
            placeholder="End"
            onChange={value => this.setState({ endDate: moment(value).unix() })}
          />
          <Button
            onClick={() => {
              clearWalletHistory();
              return this.handleSubmit(currentUsername, isGuestPage, tableView);
            }}
            type="primary"
            htmlType="submit"
          >
            {intl.formatMessage({
              id: 'append_send',
              defaultMessage: 'Submit',
            })}
          </Button>
        </Form.Item>
      </Form>
    );
  };

  handleLoadMore = () => {
    const {
      user,
      operationNum,
      isloadingMoreTableTransactions,
      isloadingMoreDemoTransactions,
      getMoreTableTransactions,
      getMoreDemoTransactions,
      usersAccountHistory,
    } = this.props;

    const currentUsername = user.name;
    const isGuestPage = guestUserRegex.test(user && user.name);
    const actions = get(usersAccountHistory, currentUsername, []);

    const loadMoreValues = {
      username: currentUsername,
      operationNumber: operationNum,
      isLoadingMore: isloadingMoreTableTransactions,
      demoIsLoadingMore: isloadingMoreDemoTransactions,
      getMoreFunction: getMoreTableTransactions,
      getMoreDemoFunction: getMoreDemoTransactions,
      transferActions: actions,
      isGuest: isGuestPage,
      table: true,
      fromDate: this.state.startDate,
      tillDate: this.state.endDate,
      types: TRANSACTION_TYPES,
    };
    return handleLoadMoreTransactions(loadMoreValues);
  };

  render() {
    const {
      user,
      intl,
      totalVestingShares,
      totalVestingFundSteem,
      hasMore,
      demoHasMoreActions,
      tableTransactionsHistory,
    } = this.props;

    const isGuestPage = guestUserRegex.test(user && user.name);
    const transactions = this.getCurrentTransactions(isGuestPage, tableTransactionsHistory);
    const currentUsername = user.name;
    const tableView = true;

    return (
      <React.Fragment>
        {this.filterPanel(currentUsername, tableView, isGuestPage)}
        <table className="WalletTable">
          <thead>
            <tr>
              <th className="WalletTable__date">
                {intl.formatMessage({
                  id: 'table_date',
                  defaultMessage: `Date`,
                })}
              </th>
              <th className="WalletTable__HIVE">
                {intl.formatMessage({
                  id: 'table_HIVE',
                  defaultMessage: `HIVE`,
                })}
              </th>
              <th className="WalletTable__HP">
                {intl.formatMessage({
                  id: 'table_HP',
                  defaultMessage: `HP`,
                })}
              </th>
              <th className="WalletTable__HBD">
                {intl.formatMessage({
                  id: 'table_HBD',
                  defaultMessage: `HBD`,
                })}
              </th>
              <th className="WalletTable__description">
                {intl.formatMessage({
                  id: 'table_description',
                  defaultMessage: `Description`,
                })}
              </th>
              <th className="WalletTable__memo">
                {intl.formatMessage({
                  id: 'table_memo',
                  defaultMessage: `Memo`,
                })}
              </th>
            </tr>
          </thead>
          <tbody>
            <ReduxInfiniteScroll
              className="WalletTable__main-content"
              loadMore={this.handleLoadMore}
              hasMore={isGuestPage ? demoHasMoreActions : hasMore}
              elementIsScrollable={false}
              threshold={500}
            >
              {transactions &&
                map(transactions, transaction => (
                  <WalletTableBodyRow
                    key={transaction.timestamp}
                    transaction={transaction}
                    isGuestPage={isGuestPage}
                    currentUsername={currentUsername}
                    totalVestingShares={totalVestingShares}
                    totalVestingFundSteem={totalVestingFundSteem}
                  />
                ))}
            </ReduxInfiniteScroll>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default WalletTable;
