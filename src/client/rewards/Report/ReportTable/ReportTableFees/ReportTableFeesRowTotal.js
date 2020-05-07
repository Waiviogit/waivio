import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './ReportTableFees.less';

const ReportTableFeesRowTotal = ({ intl, shareAmount, hiveAmount, usdAmount }) => {
  const share = shareAmount ? `% ${(shareAmount / 100).toFixed(3)}` : '';
  const usd = usdAmount ? `$ ${usdAmount}` : '';
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
        <div className="ReportTableFeesRow__amount">{hiveAmount}</div>
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
  hiveAmount: PropTypes.string.isRequired,
  usdAmount: PropTypes.string.isRequired,
};

export default injectIntl(ReportTableFeesRowTotal);
