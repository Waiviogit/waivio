import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, DatePicker, Form } from 'antd';
import { injectIntl } from 'react-intl';
import { get, map } from 'lodash';
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
} from '../reducers';
import {
  openWalletTable,
  closeWalletTable,
  getUserTableTransactionHistory,
  clearTransactionsTableHistory,
  getMoreTableUserTransactionHistory,
  getMoreUserAccountHistory,
} from './walletActions';
import {
  getDataDemoTransactions,
  handleLoadMoreTransactions,
  TRANSACTION_TYPES,
} from './WalletHelper';
import WalletTableBodyRow from './WalletTableBodyRow';
import { guestUserRegex } from '../helpers/regexHelpers';
import * as store from '../reducers';

import './WalletTable.less';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';

const getCurrentTransactions = (props, isGuestPage) => {
  const { user, transactionsHistory, demoTransactionsHistory } = props;
  const username = user.name;
  const transactions = get(transactionsHistory, username, []); // Todo: Сюда вставить транзакции по кнопке Submit
  const demoTransactions = getDataDemoTransactions(username, demoTransactionsHistory);
  return isGuestPage ? demoTransactions : transactions;
};

const handleSubmit = (
  currentUsername,
  getTransactionsByInterval,
  startDate,
  endDate,
  clearTable,
) => {
  const limit = 10;
  const tableView = true;
  clearTable();
  console.log('handle OK button: ', currentUsername);
  getTransactionsByInterval(
    currentUsername,
    limit,
    tableView,
    startDate,
    endDate,
    TRANSACTION_TYPES,
  );
};

const filterPanel = (intl, currentUsername, getTransactionsByInterval, clearTable) => {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  // clearTable()
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
          onChange={value => setStartDate(moment(value).unix())}
        />
        {intl.formatMessage({
          id: 'table_date_till',
          defaultMessage: 'Till:',
        })}
        <DatePicker placeholder="End" onChange={value => setEndDate(moment(value).unix())} />
        <Button
          onClick={() =>
            handleSubmit(currentUsername, getTransactionsByInterval, startDate, endDate, clearTable)
          }
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
    clearTable,
    hasMore,
    isloadingMoreTableTransactions,
    isloadingMoreDemoTransactions,
    getMoreTableTransactions,
    getMoreDemoTransactions,
    usersAccountHistory,
  } = props;
  useEffect(() => {
    openTable();
    return () => {
      closeTable();
      // clearTable()
    };
  }, [history.location.pathname]);

  const isGuestPage = guestUserRegex.test(user && user.name);
  const transactions = getCurrentTransactions(props, isGuestPage);
  const currentUsername = user.name;
  const actions = get(usersAccountHistory, currentUsername, []);

  const values = {
    username: currentUsername,
    operationNumber: operationNum,
    isLoadingMore: isloadingMoreTableTransactions,
    demoIsLoadingMore: isloadingMoreDemoTransactions,
    getMoreFunction: getMoreTableTransactions,
    getMoreDemoFunction: getMoreDemoTransactions,
    transferActions: actions,
    isGuest: isGuestPage,
  };

  // clearTable()
  return (
    <React.Fragment>
      {filterPanel(intl, currentUsername, getTransactionsByInterval, clearTable)}
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
            loadMore={() => handleLoadMoreTransactions(values)}
            hasMore={hasMore}
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
  hasMore: PropTypes.bool,
  clearTable: PropTypes.func,
  getMoreTableTransactions: PropTypes.func,
  getMoreDemoTransactions: PropTypes.func,
  isloadingMoreTableTransactions: PropTypes.bool,
  isloadingMoreDemoTransactions: PropTypes.bool,
  usersAccountHistory: PropTypes.shape(),
};

WalletTable.defaultProps = {
  authUserName: '',
  transactionsHistory: {},
  demoTransactionsHistory: {},
  openTable: () => {},
  closeTable: () => {},
  getTransactionsByInterval: () => {},
  clearTable: () => {},
  hasMore: false,
  getMoreTableTransactions: () => {},
  getMoreDemoTransactions: () => {},
  isloadingMoreTableTransactions: false,
  isloadingMoreDemoTransactions: false,
  usersAccountHistory: {},
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
  isloadingMoreTableTransactions: getIsloadingMoreTableTransactions,
  isloadingMoreDemoTransactions: getLoadingMoreUsersAccountHistory(state),
  usersAccountHistory: getUsersAccountHistory(state),
});

export default connect(mapStateToProps, {
  openTable: openWalletTable,
  closeTable: closeWalletTable,
  getTransactionsByInterval: getUserTableTransactionHistory,
  clearTable: clearTransactionsTableHistory,
  getMoreTableTransactions: getMoreTableUserTransactionHistory,
  getMoreDemoTransactions: getMoreUserAccountHistory,
})(injectIntl(WalletTable));
