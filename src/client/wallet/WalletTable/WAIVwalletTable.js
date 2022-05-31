import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { isEmpty, map } from 'lodash';
import { Form } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { getWaivAdvancedReports } from '../../../waivioApi/ApiClient';
import DynamicTbl from '../../components/Tools/DynamicTable/DynamicTable';
import { configWaivReportsWebsitesTableHeader } from './common/waivTableConfig';
import compareTransferBody from './common/helpers';
import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import TableFilter from './TableFilter';
import { getTransfersLoading } from '../../../store/advancedReports/advancedSelectors';
import {
  calculateTotalChanges,
  deleteUsersTransactionDate,
  getUsersTransactionDate,
  getUserTableTransactions,
} from '../../../store/advancedReports/advancedActions';

import './WalletTable.less';

const WAIVwalletTable = props => {
  const userName = props.match.params.name;
  const dispatch = useDispatch();
  const currencyInfo = useSelector(getCurrentCurrency);
  const loading = useSelector(getTransfersLoading);
  const currencyType = currencyInfo.type;

  const [transactionsList, setTransactionsList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [dateEstablished, setDateEstablished] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState(currencyType);
  const [filterAccounts, setFilterAccounts] = useState([props.match.params.name]);
  const [accounts, setAccounts] = useState({ name: props.match.params.name });

  useEffect(() => {
    getTransactionsList();
  }, [userName]);

  const getTransactionsList = async () => {
    const list = await getWaivAdvancedReports(filterAccounts, accounts);

    setAccounts(list.accounts);
    setHasMore(list.hasMore);
    setTransactionsList(list.wallet);
  };
  const getMoreTransactionsList = async () => {
    const list = await getWaivAdvancedReports(filterAccounts, accounts);

    setAccounts(list.accounts);
    setHasMore(list.hasMore);
    setTransactionsList([...transactionsList, ...list.wallet]);
  };
  const handleOnClick = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(err => !err && handleSubmit());
  };

  const handleSubmit = () => {
    const { from, end, currency } = props.form.getFieldsValue();

    if (!isEmpty(filterAccounts)) {
      setDateEstablished(true);
      setCurrentCurrency(currency);

      dispatch(
        getUserTableTransactions({
          filterAccounts,
          startDate: handleChangeStartDate(from),
          endDate: handleChangeEndDate(end),
          currency,
        }),
      );
    }
  };
  const handleSelectUserFilterAccounts = user => {
    setFilterAccounts([...filterAccounts, user.account]);
    getUsersTransactionDate(user.account);
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

  const deleteUserFromFilterAccounts = user => {
    setFilterAccounts(filterAccounts.filter(acc => acc !== user));

    props.form.setFieldsValue(filterAccounts);
    deleteUsersTransactionDate(user);
  };

  const mappedList = map(transactionsList, transaction =>
    compareTransferBody(transaction, currencyType),
  );

  const handleOnChange = (e, item) => {
    props.user && calculateTotalChanges(item, e.target.checked, currentCurrency);
  };

  return (
    <div>
      <div className="WalletTable">
        <Link to={`/@${userName}/transfers?type=WAIV`} className="WalletTable__back-btn">
          {props.intl.formatMessage({
            id: 'table_back',
            defaultMessage: 'Back',
          })}
        </Link>
      </div>
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
        currency={currencyInfo.type}
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
      <DynamicTbl
        infinity
        header={configWaivReportsWebsitesTableHeader('USD')}
        bodyConfig={mappedList}
        emptyTitle={props.intl.formatMessage({
          id: 'empty_table_transaction_list',
          defaultMessage: `You did not have any transactions during this period`,
        })}
        showMore={hasMore && !dateEstablished}
        handleShowMore={getMoreTransactionsList}
        onChange={handleOnChange}
      />
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
  user: PropTypes.string.isRequired,
};

export default injectIntl(Form.create()(WAIVwalletTable));
