import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './ReportTableRewards.less';

const ReportTableRewardsRowTotal = ({ intl, totalUSD, totalHive }) => {
  const totalUsd = totalUSD !== 0 ? `$ ${totalUSD.toFixed(2)}` : '';
  const totalHIVE = totalHive !== 0 ? `${totalHive.toFixed(3)}` : '';

  return (
    <tr>
      <td>
        <div className="ReportTableRewardsRow__total">
          {intl.formatMessage({
            id: 'debts_total',
            defaultMessage: 'Total',
          })}
        </div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__amount" />
      </td>
      <td>
        <div className="ReportTableRewardsRow__amount" />
      </td>
      <td>
        <div className="ReportTableRewardsRow__amount" />
      </td>
      <td>
        <div className="ReportTableRewardsRow__amount">
          <span>{totalHIVE}</span>
        </div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__amount">
          <span>{totalUsd}</span>
        </div>
      </td>
    </tr>
  );
};

ReportTableRewardsRowTotal.propTypes = {
  intl: PropTypes.shape().isRequired,
  totalUSD: PropTypes.number.isRequired,
  totalHive: PropTypes.number.isRequired,
};

export default injectIntl(ReportTableRewardsRowTotal);
