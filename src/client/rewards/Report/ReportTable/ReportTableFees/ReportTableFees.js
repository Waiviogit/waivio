import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { filter, map, get, reduce } from 'lodash';
import { useSelector } from 'react-redux';
import ReportTableFeesRow from '../ReportTableFees/ReportTableFeesRow';
import ReportTableFeesRowTotal from './ReportTableFeesRowTotal';
import { getSingleReportData } from '../../../../reducers';
import './ReportTableFees.less';

const getName = obj => {
  let name;
  if (obj.type === 'index_fee') {
    name = 'Rewards indexing';
  } else if (obj.type === 'referral_server_fee') {
    name = 'Referral';
  } else if (obj.type === 'campaign_server_fee') {
    name = 'Campaign management';
  }
  return name;
};

const getAccount = obj => {
  let account;
  if (obj.type === 'index_fee') {
    account = 'waivio.index';
  } else if (obj.type === 'referral_server_fee') {
    account = 'pacificgifts.acc';
  } else if (obj.type === 'campaign_server_fee') {
    account = 'waivio.campaigns';
  }
  return account;
};

const ReportTableFees = ({ intl }) => {
  const singleReportData = useSelector(getSingleReportData);

  const filteredHistory = filter(
    singleReportData.histories,
    obj =>
      obj.type === 'index_fee' ||
      obj.type === 'campaign_server_fee' ||
      obj.type === 'referral_server_fee',
  );

  const fees = reduce(
    filteredHistory,
    (result, obj) => {
      const name = getName(obj);
      const account = getAccount(obj);
      const fee = {
        name,
        account,
        share: get(obj, ['details', 'commissionWeight']) || '',
        hive: get(obj, ['amount']) || '',
        usd: get(obj, ['details', 'payableInDollars']) || '',
      };

      return [...result, fee];
    },
    [],
  );

  const shareAmount = map(fees, fee => fee.share).reduce((sum, share) => sum + share, 0);
  const hiveAmount = map(fees, fee => fee.hive).reduce((sum, hive) => sum + hive, 0);
  const usdAmount = map(fees, fee => fee.usd).reduce((sum, usd) => sum + usd, 0);

  return (
    <React.Fragment>
      <div className="ReportTableFees__header">
        <span>
          {intl.formatMessage({ id: 'processing_fees', defaultMessage: 'Processing fees***' })}:
        </span>
      </div>
      <table className="ReportTableFees">
        <thead>
          <tr>
            <th className="ReportTableFees maxWidth" rowSpan="2">
              {intl.formatMessage({
                id: 'processing_fees',
                defaultMessage: 'Processing fees',
              })}
              ***
            </th>
            <th className="ReportTableFees mediumWidth">
              {intl.formatMessage({ id: 'account', defaultMessage: `Account` })}
            </th>
            <th className="ReportTableFees basicWidth">
              {intl.formatMessage({ id: 'share', defaultMessage: `Share` })}
            </th>
            <th className="ReportTableFees basicWidth">
              {intl
                .formatMessage({
                  id: 'hive',
                  defaultMessage: 'HIVE',
                })
                .toUpperCase()}
            </th>
            <th className="ReportTableFees basicWidth">
              {intl.formatMessage({
                id: 'usd)',
                defaultMessage: 'USD',
              })}
              *
            </th>
          </tr>
        </thead>
        <tbody>
          {map(fees, fee => (
            <ReportTableFeesRow key={fee.account} {...fee} />
          ))}
          <ReportTableFeesRowTotal
            shareAmount={shareAmount}
            hiveAmount={hiveAmount}
            usdAmount={usdAmount}
          />
        </tbody>
      </table>
    </React.Fragment>
  );
};

ReportTableFees.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ReportTableFees);
