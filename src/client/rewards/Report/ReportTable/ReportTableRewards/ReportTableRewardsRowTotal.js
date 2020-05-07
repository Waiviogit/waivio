import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './ReportTableRewards.less';

const ReportTableRewardsRowTotal = ({ intl, totalUSD, totalHive }) => {
  const totalUsd = `$ ${totalUSD}`;
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
          <span>{totalHive}</span>
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
  totalUSD: PropTypes.string.isRequired,
  totalHive: PropTypes.string.isRequired,
};

export default injectIntl(ReportTableRewardsRowTotal);
