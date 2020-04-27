import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map } from 'lodash';
import ReportTableFeesRow from '../ReportTableFees/ReportTableFeesRow';
import './ReportTableFees.less';
import ReportTableFeesRowTotal from './ReportTableFeesRowTotal';

const ReportTableFees = ({ intl }) => {
  const fees = [
    {
      name: 'Campaign management',
      account: 'waivio.campaigns',
      share: 2.5,
      hive: 0.625,
      usd: 0.09,
    },
    {
      name: 'Rewards indexing',
      account: 'waivio.index',
      share: 1.0,
      hive: 0.25,
      usd: 0.04,
    },
    {
      name: 'Referral',
      account: 'pacificgifts.acc',
      share: 1.5,
      hive: 0.375,
      usd: 0.06,
    },
  ];

  const shareAmount = map(fees, fee => fee.share).reduce((sum, share) => sum + share);
  const hiveAmount = map(fees, fee => fee.hive).reduce((sum, hive) => sum + hive);
  const usdAmount = map(fees, fee => fee.usd).reduce((sum, usd) => sum + usd);

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
  // beneficiaries: PropTypes.shape().isRequired,
};

export default injectIntl(ReportTableFees);
