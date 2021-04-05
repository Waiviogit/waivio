import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './ReportTableFees.less';

const ReportTableFeesRowTotal = ({ intl, shareAmount, hiveAmount, usdAmount }) => {
  const share = shareAmount !== 0 ? `${(shareAmount / 100).toFixed(2)} %` : '';
  const usd = usdAmount !== 0 ? `$ ${usdAmount.toFixed(2)}` : '';
  const hive = hiveAmount !== 0 ? `${hiveAmount.toFixed(3)}` : '';

  return (
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
        <div className="ReportTableFeesRow__amount">{share}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__amount">{hive}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__amount">{usd}</div>
      </td>
    </tr>
  );
};

ReportTableFeesRowTotal.propTypes = {
  intl: PropTypes.shape().isRequired,
  shareAmount: PropTypes.number.isRequired,
  hiveAmount: PropTypes.number.isRequired,
  usdAmount: PropTypes.number.isRequired,
};

export default injectIntl(ReportTableFeesRowTotal);
