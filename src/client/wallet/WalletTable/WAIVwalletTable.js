import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormattedNumber, injectIntl } from 'react-intl';
import { isEmpty, map, round } from 'lodash';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../../components/Icon/Loading';
import { excludeAdvancedReports, getWaivAdvancedReports } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configWaivReportsWebsitesTableHeader } from './common/waivTableConfig';
import compareTransferBody from './common/helpers';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import TableFilter from './TableFilter';
import { closeWalletTable, openWalletTable } from '../../../store/walletStore/walletActions';
import {
  deleteUsersTransactionDate,
  getUsersTransactionDate,
} from '../../../store/advancedReports/advancedActions';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import './WalletTable.less';

const WAIVwalletTable = props => {
  const walletType = 'WAIV';
  const userName = props.match.params.name;
  const authUserName = useSelector(getAuthenticatedUserName);
  const currencyInfo = useSelector(getCurrentCurrency);
  const currencyType = currencyInfo.type;
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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const loadingBar = isLoadingData ? 'Loading...' : 'Completed';

  const closeTable = () => dispatch(closeWalletTable());

  useEffect(() => {
    dispatch(openWalletTable());
    getTransactionsList();
    dispatch(getUsersTransactionDate(userName));
  }, [userName]);

  useEffect(() => {
    dispatch(openWalletTable());
    getTransactionsList();

    return () => {
      closeTable();
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(accounts) && hasMore && dateEstablished) {
      setIsLoadingData(true);
      getMoreTransactionsList();
    }

    if (!hasMore) {
      setIsLoadingData(false);
      setLoading(false);
    }
  }, [hasMore, accounts]);

  const getTransactionsList = async () => {
    const list = await getWaivAdvancedReports({
      filterAccounts,
      accounts,
      currency: currentCurrency,
      user: authUserName,
    });

    setTransactionsList(list.wallet);
    setAccounts(list.accounts);
    setHasMore(list.hasMore);
  };

  const handleOnClick = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(err => {
      if (!err && !isEmpty(filterAccounts)) {
        handleSubmit();
      }
    });
  };

  const handleSelectUserFilterAccounts = userAcc => {
    const extendedUsersArray = [...filterAccounts, userAcc.account];

    dispatch(getUsersTransactionDate(userAcc.account));
    setFilterAccounts(extendedUsersArray);
    setAccounts(extendedUsersArray.map(name => ({ name })));
  };

  const handleSubmit = async () => {
    const { from, end, currency } = props.form.getFieldsValue();
    const startDate = handleChangeStartDate(from);
    const endDate = handleChangeEndDate(end);

    setLoading(true);
    setIsLoadingData(true);

    if (!isEmpty(filterAccounts)) {
      setDateEstablished(true);
      setCurrentCurrency(currency);

      const mappedAccounts = filterAccounts.map(acc => ({ name: acc }));
      const filteredList = await getWaivAdvancedReports({
        filterAccounts,
        accounts: mappedAccounts,
        startDate,
        endDate,
        user: userName,
        currency,
      });

      await setLoading(false);
      setWithdrawals(filteredList.withdrawals);
      setDeposits(filteredList.deposits);
      setTransactionsList(filteredList.wallet);
      setAccounts(filteredList.accounts);
      setHasMore(filteredList.hasMore);
    }
  };
  const getMoreTransactionsList = async () => {
    if (dateEstablished) {
      const { from, end } = props.form.getFieldsValue();
      const startDate = handleChangeStartDate(from);
      const endDate = handleChangeEndDate(end);

      const list = await getWaivAdvancedReports({
        filterAccounts,
        accounts,
        startDate,
        endDate,
        user: userName,
        currency: currentCurrency,
      });

      setWithdrawals(withdrawals + list.withdrawals);
      setDeposits(deposits + list.deposits);
      setTransactionsList([...transactionsList, ...list.wallet]);
      setAccounts(list.accounts);
      setHasMore(list.hasMore);
    } else {
      const list = await getWaivAdvancedReports({
        filterAccounts,
        accounts,
        currency: currentCurrency,
        user: userName,
      });

      setTransactionsList([...transactionsList, ...list.wallet]);
      setAccounts(list.accounts);
      setHasMore(list.hasMore);
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
    if (dateEstablished) {
      const num = loading ? 0 : round(value, 3);

      return (
        <b>
          {/* eslint-disable-next-line react/style-prop-object */}
          <FormattedNumber style="currency" currency={currentCurrency} value={num} />
        </b>
      );
    }

    return '-';
  };

  const deleteUserFromFilterAccounts = userAccount => {
    setFilterAccounts(filterAccounts.filter(acc => acc !== userAccount));
    dispatch(deleteUsersTransactionDate(userAccount));
    props.form.setFieldsValue(filterAccounts);
  };

  const mappedList = map(transactionsList, transaction =>
    compareTransferBody(transaction, currentCurrency, walletType),
  );

  const calculateTotalChanges = (item, checked) => {
    const amount = checked ? item[currentCurrency] * -1 : item[currentCurrency];

    if (item.withdrawDeposit === 'd') {
      setDeposits(deposits + amount);
    }
    if (item.withdrawDeposit === 'w') {
      setWithdrawals(withdrawals + amount);
    }
  };

  const excludeTransfer = item => {
    const transferList = [...transactionsList];
    const transferIndex = transferList.findIndex(transaction => transaction._id === item._id);
    const transfer = transferList[transferIndex];

    transferList.splice(transferIndex, 1, {
      ...transfer,
      checked: !transfer.checked,
    });

    setTransactionsList(transferList);
  };
  const handleOnChange = (e, item) => {
    calculateTotalChanges(item, e.target.checked);
    authUserName &&
      excludeAdvancedReports({
        userName: authUserName,
        recordId: item._id,
        userWithExemptions: item.account,
        checked: e.target.checked,
        symbol: 'WAIV',
      });
    excludeTransfer(item);
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
        {loading ? (
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
