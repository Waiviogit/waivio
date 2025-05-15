import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import { FormattedNumber, injectIntl } from 'react-intl';
import { round, map, isEmpty, isEqual } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import {
  openWalletTable,
  closeWalletTable,
  getGlobalProperties,
} from '../../../store/walletStore/walletActions';
import { configWaivReportsWebsitesTableHeader } from './common/waivTableConfig';
import TableFilter from './TableFilter';
import {
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../store/walletStore/walletSelectors';
import {
  deleteUsersTransactionDate,
  resetReportsData,
  getUsersTransactionDate,
} from '../../../store/advancedReports/advancedActions';
import compareTransferBody from './common/helpers';
import {
  getIsLoadingAllData,
  getReportAccounts,
  getReportCurrency,
  getTransactions,
  getTransactionsHasMore,
  getTransfersAccounts,
  getTransfersDeposits,
  getTransfersLoading,
  getTransfersWithdrawals,
} from '../../../store/advancedReports/advancedSelectors';
import { getAuthenticatedUser } from '../../../store/authStore/authSelectors';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configReportsWebsitesTableHeader } from './common/tableConfig';
import Loading from '../../components/Icon/Loading';
import { getCurrency } from '../../../store/appStore/appSelectors';

import './WalletTable.less';
import * as ApiClient from '../../../waivioApi/ApiClient';
import { currencyPrefix } from '../../websites/constants/currencyTypes';

@Form.create()
@withRouter
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
    currency: getCurrency(state),
    reportCurrency: getReportCurrency(state),
    reportAccounts: getReportAccounts(state),
    user: getAuthenticatedUser(state),
  }),
  {
    openTable: openWalletTable,
    closeTable: closeWalletTable,
    getUsersTransactionDate,
    deleteUsersTransactionDate,
    getGlobalProperties,
    resetReportsData,
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
        reportId: PropTypes.string,
      }),
    }).isRequired,
    currency: PropTypes.string.isRequired,
    reportAccounts: PropTypes.arrayOf(PropTypes.string),
    totalVestingShares: PropTypes.string.isRequired,
    withoutFilters: PropTypes.string,
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
    user: PropTypes.string,
    reportCurrency: PropTypes.string,
  };

  static defaultProps = {
    hasMore: false,
    deposits: 0,
    withdrawals: 0,
    transactionsList: [],
    accounts: [],
    loading: false,
    withoutFilters: false,
    user: '',
  };

  state = {
    isEmptyPeriod: true,
    filterAccounts: [this.props.match.params.name],
    dateEstablished: false,
    currentCurrency:
      this.props.match.params[0] === 'details' ? this.props.reportCurrency : this.props.currency,
    tableType: this.props.match.params[0] === 'table' ? 'HIVE' : 'WAIV',
    forCSV: [],
    hasMoreforCSV: false,
    csvLoading: this.props.withoutFilters,
  };

  componentDidMount() {
    const { filterAccounts, tableType } = this.state;
    const { totalVestingShares, totalVestingFundSteem } = this.props;

    this.props.openTable();
    this.props.form.setFieldsValue({ filterAccounts });
    this.props
      .getUserTableTransactions({
        filterAccounts,
        currency: this.props.currency,
        type: tableType,
        addSwaps: true,
      })
      .then(({ value }) => {
        this.setState({
          forCSV: value.data.wallet,
          hasMoreforCSV: value.data.hasMore,
          csvLoading: value.data.hasMore,
        });
      });
    this.props.getUsersTransactionDate(this.props.match.params.name);

    if (!totalVestingShares && !totalVestingFundSteem) this.props.getGlobalProperties();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currency !== this.props.currency && !this.props.withoutFilters) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        {
          currentCurrency: this.props.currency,
        },
        () => {
          const { addSwaps } = this.props.form.getFieldsValue();

          this.props.getUserTableTransactions({
            filterAccounts: this.state.filterAccounts,
            currency: this.props.currency,
            type: this.state.tableType,
            addSwaps: addSwaps || false,
          });
        },
      );
    }
    if (
      !isEmpty(this.props.accounts) &&
      !isEqual(prevProps.accounts, this.props.accounts) &&
      this.props.hasMore &&
      this.state.dateEstablished
    ) {
      this.handleLoadMore();
    }

    if (this.state.hasMoreforCSV && this.props.withoutFilters) {
      ApiClient.getReportsDetails(
        this.props.match.params.reportId,
        this.state.forCSV?.length,
        500,
      ).then(res => {
        this.setState({
          forCSV: [...this.state.forCSV, ...res.wallet],
          hasMoreforCSV: res.hasMore,
          csvLoading: res.hasMore,
        });
      });
    }
  }

  componentWillUnmount() {
    this.props.closeTable();
    this.props.resetReportsData();
  }

  handleSubmit = () => {
    const { from, end, currency, addSwaps } = this.props.form.getFieldsValue();

    if (!isEmpty(this.state.filterAccounts)) {
      this.setState({ dateEstablished: true, currentCurrency: currency });

      this.props.getUserTableTransactions({
        filterAccounts: this.state.filterAccounts,
        startDate: this.handleChangeStartDate(from),
        endDate: this.handleChangeEndDate(end),
        currency,
        type: this.state.tableType,
        addSwaps: addSwaps || false,
      });
    }
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

  handleLoadMore = () => {
    const { from, end, addSwaps } = this.props.form.getFieldsValue();

    return this.props.getMoreTableUserTransactionHistory({
      filterAccounts: this.state.filterAccounts,
      currency: this.state.currentCurrency,
      addSwaps,
      type: this.state.tableType,
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
    const endDate = isToday ? value || date : date.endOf('day');

    return endDate.unix();
  };

  handleChangeStartDate = value =>
    moment(value)
      .startOf('day')
      .unix();

  handleOnChange = (e, item) => {
    const currentCurrency =
      this.props.match.params[0] === 'details'
        ? this.props.reportCurrency
        : this.state.currentCurrency;

    this.props.user &&
      this.props.calculateTotalChanges(
        item,
        e.target.checked,
        currentCurrency,
        this.state.tableType,
      );
  };

  exportCsv = () => {
    const { transactionsList, currency } = this.props;
    const currencyType = this.state.currentCurrency || currency;
    const walletType = this.state.tableType;
    const isHive = walletType === 'HIVE';
    const currentCurrency =
      this.props.match.params[0] === 'details' ? this.props.reportCurrency : currencyType;
    const template = isHive
      ? {
          checked: 0,
          dateForTable: 1,
          fieldHIVE: 2,
          fieldHP: 3,
          fieldHBD: 4,
          hiveCurrentCurrency: 5,
          hbdCurrentCurrency: 6,
          withdrawDeposit: 7,
          userName: 8,
          fieldDescriptionForTable: 9,
          fieldMemo: 10,
        }
      : {
          checked: 0,
          dateForTable: 1,
          fieldWAIV: 2,
          fieldWP: 3,
          waivCurrentCurrency: 4,
          withdrawDeposit: 5,
          account: 6,
          fieldDescriptionForTable: 7,
          fieldMemo: 8,
        };
    const mappedList = map(
      this.props.withoutFilters ? this.state.forCSV : transactionsList,
      transaction =>
        compareTransferBody(
          transaction,
          currentCurrency,
          walletType,
          this.props.totalVestingShares,
          this.props.totalVestingFundSteem,
        ),
    );
    const csvHiveArray = mappedList.map(transaction => {
      const newArr = [];

      Object.entries(template).forEach(item => {
        if (item[0] === 'checked') {
          newArr[item[1]] = transaction?.[item[0]] ? 1 : 0;

          return;
        }
        if (item[0] === 'fieldMemo') {
          newArr[item[1]] = transaction?.[item[0]]?.replace(',', ' ');
        } else {
          newArr[item[1]] = transaction?.[item[0]] || '';
        }
      });

      return newArr;
    });
    const currArr = isHive
      ? [
          'HIVE',
          'HP',
          'HBD',
          `HIVE/${this.state.currentCurrency}`,
          `HBD/${this.state.currentCurrency}`,
        ]
      : ['WAIV', 'WP', `WAIV/${currentCurrency}`];

    const rows = this.props.withoutFilters
      ? [
          [
            'Total Deposits',
            `${currencyPrefix[currentCurrency]}${this.props.deposits}`,
            'Total Withdrawals',
            `${currencyPrefix[currentCurrency]}${this.props.withdrawals}`,
          ],
          ['X', 'Date', ...currArr, '±', 'Account', 'Description', 'Memo'],
          ...csvHiveArray,
        ]
      : [['X', 'Date', ...currArr, '±', 'Account', 'Description', 'Memo'], ...csvHiveArray];

    const csvContent = rows.map(e => e.join(',')).join('\n');

    if (typeof window !== 'undefined')
      window.open(`data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
  };

  render() {
    const { match, intl, form, transactionsList, currency } = this.props;
    const currencyType = this.state.currentCurrency || currency;
    const walletType = this.state.tableType;
    const { from, end } = this.props.form.getFieldsValue();
    const isHive = walletType === 'HIVE';
    const isDetailsPage = this.props.match.params[0] === 'details';
    const loadingBar =
      (isDetailsPage && this.state.csvLoading) || (!isDetailsPage && this.props.isLoadingAllData)
        ? 'Loading...'
        : 'Completed';
    const currentCurrency = isDetailsPage ? this.props.reportCurrency : currencyType;
    const handleChangeTotalValue = value =>
      (this.state.dateEstablished && !this.props.withoutFilters) ||
      (this.props.withoutFilters && value) ? (
        <b>
          {/* eslint-disable-next-line react/style-prop-object */}
          <FormattedNumber style="currency" currency={currentCurrency} value={round(value, 3)} />
        </b>
      ) : (
        '-'
      );
    const mappedList = map(transactionsList, transaction =>
      compareTransferBody(
        transaction,
        currentCurrency,
        walletType,
        this.props.totalVestingShares,
        this.props.totalVestingFundSteem,
      ),
    );

    return (
      <div className="WalletTable">
        <Link
          to={
            isDetailsPage
              ? `/@${match.params.name}/transfers/waiv-table?tab=generate`
              : `/@${match.params.name}/transfers?type=${this.state.tableType}`
          }
          className="WalletTable__back-btn"
        >
          {intl.formatMessage({
            id: 'table_back',
            defaultMessage: 'Back',
          })}
        </Link>
        {isDetailsPage ? (
          <h3 style={{ display: 'inline-block' }}>
            {intl.formatMessage({
              id: 'advanced_report',
              defaultMessage: 'Advanced report',
            })}{' '}
            {intl.formatMessage({
              id: 'for',
              defaultMessage: 'for',
            })}{' '}
            {this.props.reportAccounts.map((acc, i) => (
              <span key={acc}>
                {acc}
                {this.props.reportAccounts.length - 1 === i ? '' : ', '}
              </span>
            ))}
          </h3>
        ) : (
          <h3>
            {intl.formatMessage({
              id: 'table_view',
              defaultMessage: 'Advanced reports',
            })}
          </h3>
        )}
        {!this.props.withoutFilters && (
          <TableFilter
            intl={intl}
            filterUsersList={this.state.filterAccounts}
            getFieldDecorator={form.getFieldDecorator}
            handleOnClick={this.handleOnClick}
            handleSelectUser={this.handleSelectUserFilterAccounts}
            isLoadingTableTransactions={this.props.loading}
            deleteUser={this.deleteUserFromFilterAccounts}
            currency={currency}
            form={form}
            startDate={this.handleChangeStartDate(from)}
            endDate={this.handleChangeEndDate(end)}
          />
        )}
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
          {this.state.dateEstablished || this.props.withoutFilters
            ? loadingBar
            : intl.formatMessage({
                id: 'totals_calculated',
                defaultMessage: 'Totals can be calculated only for a defined from-till period.',
              })}
          ){' '}
          {
            <button
              disabled={
                (this.props.isLoadingAllData && this.state.dateEstablished) ||
                this.props.loading ||
                (isDetailsPage && this.state.csvLoading)
              }
              className="WalletTable__csv-button"
              onClick={this.exportCsv}
            >
              {' '}
              Export to .CSV{' '}
            </button>
          }
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
                'The information provided by this site, including financial reports, is provided on an "as is" basis with no guarantees of completeness, accuracy, usefulness or timeliness. Waivio Technologies Inc. assumes no responsibility or liability for any errors or omissions in the content of this site."',
            })}
          </span>
        </p>
        {this.props.loading && isEmpty(mappedList) ? (
          <Loading />
        ) : (
          <DynamicTbl
            infinity
            header={
              isHive
                ? configReportsWebsitesTableHeader(currentCurrency)
                : configWaivReportsWebsitesTableHeader(currentCurrency)
            }
            bodyConfig={mappedList}
            emptyTitle={intl.formatMessage({
              id: 'empty_table_transaction_list',
              defaultMessage: `You did not have any transactions during this period`,
            })}
            showMore={this.props.hasMore && !this.state.dateEstablished}
            handleShowMore={this.handleLoadMore}
            onChange={this.handleOnChange}
          />
        )}
      </div>
    );
  }
}

export default WalletTable;
