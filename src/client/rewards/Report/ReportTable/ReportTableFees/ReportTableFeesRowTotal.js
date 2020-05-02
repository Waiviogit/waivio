import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './ReportTableFees.less';

const ReportTableFeesRowTotal = ({ intl, shareAmount, hiveAmount, usdAmount }) => (
  <tr>
    <td>
      <div className="ReportTableFeesRow__total">
        {intl.formatMessage({
          id: 'debts_total',
          defaultMessage: 'Total',
        })}
      </div>
    </td>
    <td>
      <div className="ReportTableFeesRow__amount" />
    </td>
    <td>
      <div className="ReportTableFeesRow__amount">{`${shareAmount / 100}%`}</div>
    </td>
    <td>
      <div className="ReportTableFeesRow__amount">{hiveAmount}</div>
    </td>
    <td>
      <div className="ReportTableFeesRow__amount">{`$ ${usdAmount}`}</div>
    </td>
  </tr>
);

ReportTableFeesRowTotal.propTypes = {
  intl: PropTypes.shape().isRequired,
  shareAmount: PropTypes.number.isRequired,
  hiveAmount: PropTypes.string.isRequired,
  usdAmount: PropTypes.string.isRequired,
};

export default injectIntl(ReportTableFeesRowTotal);
