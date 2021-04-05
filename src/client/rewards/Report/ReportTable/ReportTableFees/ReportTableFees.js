import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { map, reduce } from 'lodash';
import { useSelector } from 'react-redux';
import ReportTableFeesRow from '../ReportTableFees/ReportTableFeesRow';
import ReportTableFeesRowTotal from './ReportTableFeesRowTotal';
import { getSingleReportData } from '../../../../reducers';
import { getProcessingFee } from '../../../rewardsHelper';
import './ReportTableFees.less';

const ReportTableFees = ({ intl }) => {
  const singleReportData = useSelector(getSingleReportData);

  const fees = reduce(
    singleReportData.histories,
    (result, obj) => {
      const fee = getProcessingFee(obj);

      return fee ? [...result, fee] : result;
    },
    [],
  );

  const shareAmount = Number(map(fees, fee => fee.share).reduce((sum, share) => sum + share, 0));
  const hiveAmount = Number(map(fees, fee => fee.hive).reduce((sum, hive) => sum + hive, 0));
  const usdAmount = Number(map(fees, fee => fee.usd).reduce((sum, usd) => sum + usd, 0));

  return (
    <React.Fragment>
      <div className="ReportTableFees__header">
        <span>
          {intl.formatMessage({ id: 'processing_fees', defaultMessage: 'Processing fees' })}***:
        </span>
      </div>
      <table className="ReportTableFees">
        <thead>
          <tr>
            <th className="ReportTableFees maxWidth" rowSpan="2">
              {intl.formatMessage({
                id: 'services',
                defaultMessage: 'Services',
              })}
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
