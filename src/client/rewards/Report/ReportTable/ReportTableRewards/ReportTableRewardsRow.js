import React from 'react';
// import PropTypes from 'prop-types';

const ReportTableRewardsRow = beneficiary => {
  const weight = beneficiary.weight / 100;
  return (
    <tr>
      <td>
        <div className="ReportTableRewardsRow__name">{beneficiary.account}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__weigth">{`${weight}%`}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__hivePower">2.425</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__hive">21.825</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalHive">24.250</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalUsd">$ 3.64</div>
      </td>
    </tr>
  );
};

ReportTableRewardsRow.propTypes = {
  // beneficiary: PropTypes.shape().isRequired,
};

export default ReportTableRewardsRow;
