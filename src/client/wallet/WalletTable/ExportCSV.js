import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { isEmpty, map } from 'lodash';
import { useSelector } from 'react-redux';

import Loading from '../../components/Icon/Loading';
import * as ApiClient from '../../../waivioApi/ApiClient';

import compareTransferBody from './common/helpers';
import { currencyPrefix } from '../../websites/constants/currencyTypes';
import {
  getTotalVestingFundSteem,
  getTotalVestingShares,
} from '../../../store/walletStore/walletSelectors';

import './ExportCSV.less';

const ExportCsv = ({ disabled, item, toggleDisabled }) => {
  const [csv, setCSV] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [skip, setSkip] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const totalVestingShares = useSelector(getTotalVestingShares);
  const totalVestingFundSteem = useSelector(getTotalVestingFundSteem);
  const exportCsv = () => {
    const currentCurrency = item.currency;
    const template = {
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
    const mappedList = map(csv, transaction =>
      compareTransferBody(
        transaction,
        currentCurrency,
        'WAIV',
        totalVestingShares,
        totalVestingFundSteem,
      ),
    );
    const csvHiveArray = mappedList.map(transaction => {
      const newArr = [];

      Object.entries(template).forEach(i => {
        if (i[0] === 'checked') {
          newArr[i[1]] = transaction?.[i[0]] ? 1 : 0;

          return;
        }
        if (i[0] === 'fieldMemo') {
          newArr[i[1]] = transaction?.[i[0]]?.replace(',', ' ');
        } else {
          newArr[i[1]] = transaction?.[i[0]] || '';
        }
      });

      return newArr;
    });
    const currArr = ['WAIV', 'WP', `WAIV/${currentCurrency}`];

    const rows = [
      [
        'Total Deposits',
        `${currencyPrefix[currentCurrency]}${item.deposits}`,
        'Total Withdrawals',
        `${currencyPrefix[currentCurrency]}${item.withdrawals}`,
      ],
      ['X', 'Date', ...currArr, '±', 'Account', 'Description', 'Memo'],
      ...csvHiveArray,
    ];
    const csvContent = rows.map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    if (document) {
      const link = document.createElement('a');

      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const getTransactions = useCallback(
    s => {
      setSkip(s);
      ApiClient.getReportsDetails(item.reportId, s, 500).then(res => {
        setHasMore(res.hasMore);
        setCSV([...csv, ...res.wallet]);
        if (!res.hasMore) {
          setLoading(false);
          toggleDisabled(false);
          setSaved(true);
          if (isEmpty(res.wallet) && isEmpty(csv))
            message.warning('There are no records available.');
          else {
            message.success('Data retrieval successful! You can now save it.');
          }
        }
      });
    },
    [csv],
  );

  const handleClick = () => {
    message.info(
      "We're preparing your data for download. Please wait as this might take some time and do not leave this page.",
    );
    setLoading(true);
    toggleDisabled(true);
    getTransactions(0);
  };

  useEffect(() => {
    if (hasMore && csv.length !== skip && !saved) getTransactions(csv.length);
  }, [csv]);

  if (saved && isEmpty(csv)) {
    return <span>empty</span>;
  }

  return !saved ? (
    <button className={'ExportCSV'} disabled={disabled} onClick={handleClick}>
      {loading ? <Loading /> : 'export'}
    </button>
  ) : (
    <button className={'ExportCSV'} onClick={exportCsv}>
      save
    </button>
  );
};

ExportCsv.propTypes = {
  disabled: PropTypes.bool,
  item: PropTypes.shape({
    reportId: PropTypes.string,
    currency: PropTypes.string,
    deposits: PropTypes.number,
    withdrawals: PropTypes.number,
  }),
  toggleDisabled: PropTypes.func,
};

export default ExportCsv;
