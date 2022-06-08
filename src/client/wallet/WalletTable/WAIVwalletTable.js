import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedNumber, injectIntl } from 'react-intl';
import { isEmpty, map, round } from 'lodash';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import { getWaivAdvancedReports } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configWaivReportsWebsitesTableHeader } from './common/waivTableConfig';
import compareTransferBody from './common/helpers';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import TableFilter from './TableFilter';
import { closeWalletTable, openWalletTable } from '../../../store/walletStore/walletActions';

import './WalletTable.less';
import { getIsLoadingAllData } from '../../../store/advancedReports/advancedSelectors';

const WAIVwalletTable = props => {
  const userName = props.match.params.name;
  const currencyInfo = useSelector(getCurrentCurrency);
  const currencyType = currencyInfo.type;
  const isLoadingAllData = useSelector(getIsLoadingAllData);
  // console.log(isLoadingAllData)
  const dispatch = useDispatch();
  const [transactionsList, setTransactionsList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [dateEstablished, setDateEstablished] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(currencyType);
  const [filterAccounts, setFilterAccounts] = useState([props.match.params.name]);
  const [accounts, setAccounts] = useState([{ name: userName }]);
  const [deposits, setDeposits] = useState(0);
  const [withdrawals, setWithdrawals] = useState(0);
  const [loading, setLoading] = useState(false);
  const loadingBar = loading ? 'Loading...' : 'Completed';

  const closeTable = () => dispatch(closeWalletTable());

  useEffect(() => {
    dispatch(openWalletTable());
    getTransactionsList();
  }, [userName]);

  useEffect(() => {
    if (!isEmpty(accounts) && hasMore && dateEstablished) {
      getMoreTransactionsList();
    }
  }, [hasMore, accounts]);

  const getTransactionsList = async () => {
    const list = await getWaivAdvancedReports(filterAccounts, accounts);

    setTransactionsList(list.wallet);
    setAccounts(list.accounts);
    setHasMore(list.hasMore);
  };

  const handleOnClick = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(err => !err && handleSubmit());
  };

  const handleSelectUserFilterAccounts = userAcc => {
    const extendedUsersArray = [...filterAccounts, userAcc.account];

    setFilterAccounts(extendedUsersArray);
    setAccounts(extendedUsersArray.map(name => ({ name })));
  };
  const handleSubmit = async () => {
    const { from, end, currency } = props.form.getFieldsValue();

    setLoading(true);

    if (!isEmpty(filterAccounts)) {
      setDateEstablished(true);
      setCurrentCurrency(currency);

      const mappedAccounts = filterAccounts.map(acc => ({ name: acc }));
      const filteredList = await getWaivAdvancedReports(
        filterAccounts,
        mappedAccounts,
        handleChangeStartDate(from),
        handleChangeEndDate(end),
        currency,
      );

      await setLoading(false);
      setDeposits(filteredList.deposits);
      setWithdrawals(filteredList.withdrawals);
      setTransactionsList(filteredList.wallet);
      setAccounts(filteredList.accounts);
      setHasMore(filteredList.hasMore);
    }
  };
  const getMoreTransactionsList = async () => {
    if (dateEstablished) {
      const { from, end, currency } = props.form.getFieldsValue();

      const list = await getWaivAdvancedReports(
        filterAccounts,
        accounts,
        handleChangeStartDate(from),
        handleChangeEndDate(end),
        currency,
      );

      setTransactionsList([...transactionsList, ...list.wallet]);
      setAccounts(list.accounts);
      setHasMore(list.hasMore);
      setDeposits(deposits + list.deposits);
      setWithdrawals(withdrawals + list.withdrawals);
    } else {
      const list = await getWaivAdvancedReports(filterAccounts, accounts);

      setTransactionsList([...transactionsList, ...list.wallet]);
      setAccounts(list.accounts);
      setHasMore(list.hasMore);
      setDeposits(deposits + list.deposits);
      setWithdrawals(withdrawals + list.withdrawals);
    }
  };

  const handleChangeStartDate = value =>
    moment(value)
      .startOf('day')
      .unix();

  const handleChangeEndDate = value => {
    const date = moment(value);
    const isToday =
      date.startOf('day').unix() ===
      moment()
        .startOf('day')
        .unix();
    const endDate = isToday ? moment() : date.endOf('day');

    return endDate.unix();
  };

  const handleChangeTotalValue = value => {
    if (dateEstablished && !hasMore && !isLoadingAllData) {
      return (
        <b>
          {/* eslint-disable-next-line react/style-prop-object */}
          <FormattedNumber style="currency" currency={currencyType} value={round(value, 3)} />
        </b>
      );
    }
    if (dateEstablished && hasMore) {
      return 0;
    }

    return '-';
  };

  const deleteUserFromFilterAccounts = userAccount => {
    setFilterAccounts(filterAccounts.filter(acc => acc !== userAccount));
    props.form.setFieldsValue(filterAccounts);
  };

  const mappedList = map(transactionsList, transaction =>
    compareTransferBody(transaction, currentCurrency),
  );

  const handleOnChange = (e, item) => {
    const w = new BigNumber(round(withdrawals, 3));
    const d = new BigNumber(round(deposits, 3));

    if (e.target.checked) {
      if (item.withdrawDeposit === 'd') {
        setDeposits(Number(d.minus(item.USD).toFixed(3)));
      }
      if (item.withdrawDeposit === 'w') {
        setWithdrawals(Number(w.minus(item.USD).toFixed(3)));
      }
    } else {
      if (item.withdrawDeposit === 'd') {
        setDeposits(Number(d.plus(item.USD).toFixed(3)));
      }
      if (item.withdrawDeposit === 'w') {
        setWithdrawals(Number(w.plus(item.USD).toFixed(3)));
      }
    }
  };

  return (
    <div>
      <div className="WalletTable">
        <Link
          onClick={closeTable}
          to={`/@${userName}/transfers?type=WAIV`}
          className="WalletTable__back-btn"
        >
          {props.intl.formatMessage({
            id: 'table_back',
            defaultMessage: 'Back',
          })}
        </Link>
        <h3>
          {props.intl.formatMessage({
            id: 'table_view',
            defaultMessage: 'Advanced reports',
          })}
        </h3>
        <TableFilter
          intl={props.intl}
          filterUsersList={filterAccounts}
          getFieldDecorator={props.form.getFieldDecorator}
          handleOnClick={handleOnClick}
          handleSelectUser={handleSelectUserFilterAccounts}
          isLoadingTableTransactions={loading}
          deleteUser={deleteUserFromFilterAccounts}
          currency={currentCurrency}
          form={props.form}
        />
        <p className="WalletTable__total">
          {props.intl.formatMessage({
            id: 'total',
            defaultMessage: 'TOTAL',
          })}
          :{' '}
          {props.intl.formatMessage({
            id: 'Deposits',
            defaultMessage: 'Deposits',
          })}
          : {handleChangeTotalValue(deposits)}.{' '}
          {props.intl.formatMessage({
            id: 'Withdrawals',
            defaultMessage: 'Withdrawals',
          })}
          : {handleChangeTotalValue(withdrawals)}. (
          {dateEstablished
            ? loadingBar
            : props.intl.formatMessage({
                id: 'totals_calculated',
                defaultMessage: 'Totals can be calculated only for a defined from-till period.',
              })}
          )
        </p>
        <p className="WalletTable__exclude">
          X) -{' '}
          {props.intl.formatMessage({
            id: 'x_field_description',
            defaultMessage: 'Use this field to exclude an entry from the totals calculation.',
          })}
        </p>
        <p className="WalletTable__disclaimer">
          <b>
            {props.intl.formatMessage({
              id: 'disclaimer',
              defaultMessage: 'Disclaimer',
            })}
            :{' '}
          </b>
          <span className="WalletTable__exclude">
            {props.intl.formatMessage({
              id: 'disclaimer_info',
              defaultMessage:
                'The information provided by this site, including financial reports, is provided on an ""as is"" basis with no guarantees of completeness, accuracy, usefulness or timeliness. Waivio Technologies Inc. assumes no responsibility or liability for any errors or omissions in the content of this site."',
            })}
          </span>
        </p>
        {loading && isEmpty(mappedList) ? (
          <Loading />
        ) : (
          <DynamicTbl
            infinity
            header={configWaivReportsWebsitesTableHeader(currentCurrency)}
            bodyConfig={mappedList}
            emptyTitle={props.intl.formatMessage({
              id: 'empty_table_transaction_list',
              defaultMessage: `You did not have any transactions during this period`,
            })}
            showMore={hasMore && !dateEstablished}
            handleShowMore={getMoreTransactionsList}
            onChange={handleOnChange}
          />
        )}
      </div>
    </div>
  );
};

WAIVwalletTable.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.shape(),
    }),
  }).isRequired,
  currencyInfo: PropTypes.shape({
    type: PropTypes.string,
    rate: PropTypes.number,
  }).isRequired,
  form: PropTypes.shape({
    setFieldsValue: PropTypes.func,
    validateFieldsAndScroll: PropTypes.func,
    getFieldDecorator: PropTypes.func,
    getFieldsValue: PropTypes.func,
  }).isRequired,
};

export default injectIntl(Form.create()(WAIVwalletTable));
