import React, { useEffect, useState } from 'react';
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
import {
  getDataDemoTransactions,
  handleLoadMoreTransactions,
  TRANSACTION_TYPES,
} from './WalletHelper';
import WalletTableBodyRow from './WalletTableBodyRow';
import { guestUserRegex } from '../helpers/regexHelpers';
import * as store from '../reducers';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';

import './WalletTable.less';

const getCurrentTransactions = (
  { user, transactionsHistory, demoTransactionsHistory },
  isGuestPage,
  tableTransactionsHistory,
) => {
  const username = user.name;
  if (!isGuestPage && !size(transactionsHistory)) {
    return get(tableTransactionsHistory, username, []);
  }
  if (isGuestPage) {
    return getDataDemoTransactions(username, demoTransactionsHistory);
  }
  return get(transactionsHistory, username, []);
};

const handleSubmit = (
  currentUsername,
  getTransactionsByInterval,
  getDemoTransactionsByInterval,
  startDate,
  endDate,
  clearTable,
  tableView,
  isGuestPage,
  // operationNum, // Todo отправлять после фиксов с бэка. Неправильная фильтрация
) => {
  const limit = 10;
  if (isGuestPage) {
    getDemoTransactionsByInterval(currentUsername, tableView, startDate, endDate);
  } else {
    console.log('here'); // Todo: тут не отрабатывает
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

const filterPanel = (
  intl,
  currentUsername,
  getTransactionsByInterval,
  getDemoTransactionsByInterval,
  clearTable,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  tableView,
  clearWalletHistory,
  operationNum,
  isGuestPage,
) => (
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
        onChange={value => setStartDate(moment(value).unix())}
      />
      {intl.formatMessage({
        id: 'table_date_till',
        defaultMessage: 'Till:',
      })}
      <DatePicker placeholder="End" onChange={value => setEndDate(moment(value).unix())} />
      <Button
        onClick={() => {
          clearWalletHistory();
          return handleSubmit(
            currentUsername,
            getTransactionsByInterval,
            getDemoTransactionsByInterval,
            startDate,
            endDate,
            clearTable,
            tableView,
            clearWalletHistory,
            operationNum,
            isGuestPage,
          );
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
const WalletTable = props => {
  const {
    user,
    intl,
    authUserName,
    totalVestingShares,
    totalVestingFundSteem,
    history,
    openTable,
    closeTable,
    operationNum,
    getTransactionsByInterval,
    getDemoTransactionsByInterval,
    clearTable,
    hasMore,
    demoHasMoreActions,
    isloadingMoreTableTransactions,
    isloadingMoreDemoTransactions,
    getMoreTableTransactions,
    getMoreDemoTransactions,
    usersAccountHistory,
    tableTransactionsHistory,
    clearWalletHistory,
  } = props;
  useEffect(() => {
    openTable();
    return () => {
      closeTable();
    };
  }, [history.location.pathname]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const isGuestPage = guestUserRegex.test(user && user.name);
  const transactions = getCurrentTransactions(props, isGuestPage, tableTransactionsHistory);
  const currentUsername = user.name;
  const actions = get(usersAccountHistory, currentUsername, []);
  const tableView = true;

  const handleLoadMore = () => {
    const loadMoreValues = {
      username: currentUsername,
      operationNumber: operationNum,
      isLoadingMore: isloadingMoreTableTransactions,
      demoIsLoadingMore: isloadingMoreDemoTransactions,
      getMoreFunction: getMoreTableTransactions,
      getMoreDemoFunction: getMoreDemoTransactions,
      transferActions: actions,
      isGuest: isGuestPage,
      table: tableView,
      fromDate: startDate,
      tillDate: endDate,
      types: TRANSACTION_TYPES,
    };
    return handleLoadMoreTransactions(loadMoreValues);
  };
  return (
    <React.Fragment>
      {filterPanel(
        intl,
        currentUsername,
        getTransactionsByInterval,
        getDemoTransactionsByInterval,
        clearTable,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        tableView,
        clearWalletHistory,
        operationNum,
        isGuestPage,
      )}
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
            loadMore={handleLoadMore}
            hasMore={isGuestPage ? demoHasMoreActions : hasMore}
            elementIsScrollable={false}
            threshold={500}
          >
            {transactions &&
              map(transactions, transaction => (
                <WalletTableBodyRow
                  // key={transaction.timestamp}
                  transaction={transaction}
                  isGuestPage={isGuestPage}
                  currentUsername={currentUsername}
                  authUserName={authUserName}
                  totalVestingShares={totalVestingShares}
                  totalVestingFundSteem={totalVestingFundSteem}
                />
              ))}
          </ReduxInfiniteScroll>
        </tbody>
      </table>
    </React.Fragment>
  );
};

WalletTable.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  history: PropTypes.shape().isRequired,
  operationNum: PropTypes.number.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  authUserName: PropTypes.string,
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
};

WalletTable.defaultProps = {
  openTable: () => {},
  closeTable: () => {},
  getTransactionsByInterval: () => {},
  getDemoTransactionsByInterval: () => {},
  clearTable: () => {},
  getMoreTableTransactions: () => {},
  getMoreDemoTransactions: () => {},
  clearWalletHistory: () => {},
  authUserName: '',
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

const mapStateToProps = (state, ownProps) => ({
  user:
    ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
  authUserName: store.getAuthenticatedUserName(state),
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
});

export default connect(mapStateToProps, {
  openTable: openWalletTable,
  closeTable: closeWalletTable,
  getTransactionsByInterval: getUserTableTransactionHistory,
  getDemoTransactionsByInterval: getUserAccountHistory,
  clearTable: clearTransactionsTableHistory,
  clearWalletHistory: clearTransactionsHistory,
  getMoreTableTransactions: getMoreTableUserTransactionHistory,
  getMoreDemoTransactions: getMoreUserAccountHistory,
})(injectIntl(WalletTable));
