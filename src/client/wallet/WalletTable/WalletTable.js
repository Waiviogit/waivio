import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { FormattedNumber, injectIntl } from 'react-intl';
import { round, map, isEmpty, isEqual } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';

import {
  openWalletTable,
  closeWalletTable,
  getGlobalProperties,
} from '../../store/walletStore/walletActions';
import TableFilter from './TableFilter';
import {
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../store/walletStore/walletSelectors';
import {
  getUserTableTransactions,
  getMoreTableUserTransactionHistory,
  getUsersTransactionDate,
  deleteUsersTransactionDate,
  resetReportsData,
  calculateTotalChanges,
  excludeTransfer,
} from '../../store/advancedReports/advancedActions';
import compareTransferBody from './common/helpers';
import {
  getIsLoadingAllData,
  getTransactions,
  getTransactionsHasMore,
  getTransfersAccounts,
  getTransfersDeposits,
  getTransfersLoading,
  getTransfersWithdrawals,
} from '../../store/advancedReports/advancedSelectors';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configReportsWebsitesTableHeader } from './common/tableConfig';
import Loading from '../../components/Icon/Loading';
import { getCurrentCurrency } from '../../store/appStore/appSelectors';

import './WalletTable.less';

@Form.create()
@injectIntl
@connect(
  state => ({
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    hasMore: getTransactionsHasMore(state),
    deposits: getTransfersDeposits(state),
    withdrawals: getTransfersWithdrawals(state),
    transactionsList: getTransactions(state),
    loading: getTransfersLoading(state),
    accounts: getTransfersAccounts(state),
    isLoadingAllData: getIsLoadingAllData(state),
    currencyInfo: getCurrentCurrency(state),
  }),
  {
    openTable: openWalletTable,
    closeTable: closeWalletTable,
    getUserTableTransactions,
    getMoreTableUserTransactionHistory,
    getUsersTransactionDate,
    deleteUsersTransactionDate,
    getGlobalProperties,
    calculateTotalChanges,
    resetReportsData,
    excludeTransfer,
  },
)
class WalletTable extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        name: PropTypes.string,
      }),
    }).isRequired,
    currencyInfo: PropTypes.shape({
      type: PropTypes.string,
      rate: PropTypes.number,
    }).isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    openTable: PropTypes.func.isRequired,
    closeTable: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    isLoadingAllData: PropTypes.bool.isRequired,
    form: PropTypes.shape({
      setFieldsValue: PropTypes.func,
      validateFieldsAndScroll: PropTypes.func,
      getFieldDecorator: PropTypes.func,
      getFieldsValue: PropTypes.func,
    }).isRequired,
    deposits: PropTypes.number,
    withdrawals: PropTypes.number,
    getUserTableTransactions: PropTypes.func.isRequired,
    getUsersTransactionDate: PropTypes.func.isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    deleteUsersTransactionDate: PropTypes.func.isRequired,
    calculateTotalChanges: PropTypes.func.isRequired,
    resetReportsData: PropTypes.func.isRequired,
    getMoreTableUserTransactionHistory: PropTypes.func.isRequired,
    transactionsList: PropTypes.arrayOf(PropTypes.shape({})),
    accounts: PropTypes.arrayOf(PropTypes.shape({})),
    loading: PropTypes.bool,
  };

  static defaultProps = {
    hasMore: false,
    deposits: 0,
    withdrawals: 0,
    transactionsList: [],
    accounts: [],
    loading: false,
  };

  state = {
    isEmptyPeriod: true,
    filterAccounts: [this.props.match.params.name],
    dateEstablished: false,
    currentCurrency: this.props.currencyInfo.type,
  };

  componentDidMount() {
    const { filterAccounts } = this.state;
    const { totalVestingShares, totalVestingFundSteem } = this.props;

    this.props.openTable();
    this.props.form.setFieldsValue({ filterAccounts });
    this.props.getUserTableTransactions({ filterAccounts, currency: this.props.currencyInfo.type });
    this.props.getUsersTransactionDate(this.props.match.params.name);

    if (!totalVestingShares && !totalVestingFundSteem) this.props.getGlobalProperties();
  }

  componentDidUpdate(prevProps) {
    if (
      !isEmpty(this.props.accounts) &&
      !isEqual(prevProps.accounts, this.props.accounts) &&
      this.props.hasMore &&
      this.state.dateEstablished
    ) {
      this.handleLoadMore();
    }
  }

  componentWillUnmount() {
    this.props.closeTable();
    this.props.resetReportsData();
  }

  handleSubmit = () => {
    const { from, end, currency } = this.props.form.getFieldsValue();

    this.setState({ dateEstablished: true, currentCurrency: currency });

    return this.props.getUserTableTransactions({
      filterAccounts: this.state.filterAccounts,
      startDate: this.handleChangeStartDate(from),
      endDate: this.handleChangeEndDate(end),
      currency,
    });
  };

  handleOnClick = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => !err && this.handleSubmit());
  };

  deleteUserFromFilterAccounts = user => {
    this.setState(
      preState => ({
        filterAccounts: preState.filterAccounts.filter(acc => acc !== user),
      }),
      () => {
        this.props.form.setFieldsValue({ filterAccounts: this.state.filterAccounts });
        this.props.deleteUsersTransactionDate(user);
      },
    );
  };

  handleSelectUserFilterAccounts = user => {
    this.setState(
      preState => ({
        filterAccounts: [...preState.filterAccounts, user.account],
      }),
      () => this.props.getUsersTransactionDate(user.account),
    );
  };

  handleChangeStartDate = value =>
    moment(value)
      .startOf('day')
      .unix();

  handleLoadMore = () => {
    const { from, end } = this.props.form.getFieldsValue();

    return this.props.getMoreTableUserTransactionHistory({
      filterAccounts: this.state.filterAccounts,
      currency: this.state.currentCurrency,
      ...(this.state.dateEstablished
        ? {
            startDate: this.handleChangeStartDate(from),
            endDate: this.handleChangeEndDate(end),
          }
        : {}),
    });
  };

  handleChangeEndDate = value => {
    const date = moment(value);
    const isToday =
      date.startOf('day').unix() ===
      moment()
        .startOf('day')
        .unix();
    const endDate = isToday ? moment() : date.endOf('day');

    return endDate.unix();
  };

  render() {
    const { match, intl, form, transactionsList, currencyInfo } = this.props;
    const currencyType = this.state.currentCurrency || currencyInfo.type;

    const loadingBar = this.props.isLoadingAllData ? 'Loading...' : 'Completed';
    /* eslint-disable react/style-prop-object */
    const handleChangeTotalValue = value =>
      this.state.dateEstablished ? (
        <b>
          <FormattedNumber style="currency" currency={currencyType} value={round(value, 3)} />
        </b>
      ) : (
        '-'
      );
    const mappedList = map(transactionsList, transaction =>
      compareTransferBody(
        transaction,
        this.props.totalVestingShares,
        this.props.totalVestingFundSteem,
        currencyType,
      ),
    );

    return (
      <div className="WalletTable">
        <Link to={`/@${match.params.name}/transfers`} className="WalletTable__back-btn">
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
          filterUsersList={this.state.filterAccounts}
          getFieldDecorator={form.getFieldDecorator}
          handleOnClick={this.handleOnClick}
          handleSelectUser={this.handleSelectUserFilterAccounts}
          isLoadingTableTransactions={this.props.loading}
          deleteUser={this.deleteUserFromFilterAccounts}
          currency={currencyInfo.type}
          form={form}
        />
        <p className="WalletTable__total">
          {intl.formatMessage({
            id: 'total',
            defaultMessage: 'TOTAL',
          })}
          :{' '}
          {intl.formatMessage({
            id: 'Deposits',
            defaultMessage: 'Deposits',
          })}
          : {handleChangeTotalValue(this.props.deposits)}.{' '}
          {intl.formatMessage({
            id: 'Withdrawals',
            defaultMessage: 'Withdrawals',
          })}
          : {handleChangeTotalValue(this.props.withdrawals)}. (
          {this.state.dateEstablished
            ? loadingBar
            : intl.formatMessage({
                id: 'totals_calculated',
                defaultMessage: 'Totals can be calculated only for a defined from-till period.',
              })}
          )
        </p>
        <p className="WalletTable__exclude">
          X) -{' '}
          {intl.formatMessage({
            id: 'x_field_description',
            defaultMessage: 'Use this field to exclude an entry from the totals calculation.',
          })}
        </p>
        <p className="WalletTable__disclaimer">
          <b>
            {intl.formatMessage({
              id: 'disclaimer',
              defaultMessage: 'Disclaimer',
            })}
            :{' '}
          </b>
          <span className="WalletTable__exclude">
            {intl.formatMessage({
              id: 'disclaimer_info',
              defaultMessage:
                'The information provided by this site, including financial reports, is provided on an ""as is"" basis with no guarantees of completeness, accuracy, usefulness or timeliness. Waivio Technologies Inc. assumes no responsibility or liability for any errors or omissions in the content of this site."',
            })}
          </span>
        </p>
        {this.props.loading && isEmpty(mappedList) ? (
          <Loading />
        ) : (
          <DynamicTbl
            infinity
            header={configReportsWebsitesTableHeader(this.state.currentCurrency)}
            bodyConfig={mappedList}
            emptyTitle={intl.formatMessage({
              id: 'empty_table_transaction_list',
              defaultMessage: `You did not have any transactions during this period`,
            })}
            showMore={this.props.hasMore && !this.state.dateEstablished}
            handleShowMore={this.handleLoadMore}
            onChange={(e, item) =>
              this.props.calculateTotalChanges(item, e.target.checked, this.state.currentCurrency)
            }
          />
        )}
      </div>
    );
  }
}

export default WalletTable;
