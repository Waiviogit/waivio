import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './ReportTableRewards.less';

const ReportTableRewardsRowTotal = ({ intl }) => (
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
      <div className="ReportTableRewardsRow__total" />
    </td>
    <td>
      <div className="ReportTableRewardsRow__total" />
    </td>
    <td>
      <div className="ReportTableRewardsRow__total" />
    </td>
    <td>
      <div className="ReportTableRewardsRow__total">
        <span className="ReportTableRewardsRow__total-totalHive">25.000</span>
      </div>
    </td>
    <td>
      <div className="ReportTableRewardsRow__total">
        <span className="ReportTableRewardsRow__total-totalUsd">$ 3.75</span>
      </div>
    </td>
  </tr>
);

ReportTableRewardsRowTotal.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ReportTableRewardsRowTotal);
