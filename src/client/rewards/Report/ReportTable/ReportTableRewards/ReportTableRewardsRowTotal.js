import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { round } from 'lodash';
import './ReportTableRewards.less';
import USDDisplay from '../../../../components/Utils/USDDisplay';

const ReportTableRewardsRowTotal = ({ intl, totalUSD, totalHive }) => {
  const totalUsd = totalUSD ? round(totalUSD, 2) : '';
  const totalHIVE = totalHive ? round(totalHive, 3) : '';

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
          <USDDisplay value={totalUsd} currencyDisplay="symbol" />
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
