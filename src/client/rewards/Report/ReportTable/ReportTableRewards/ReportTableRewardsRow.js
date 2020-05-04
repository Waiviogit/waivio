import React from 'react';

const ReportTableRewardsRow = beneficiary => {
  const weight = beneficiary.weight ? `${beneficiary.weight}%` : '';
  const votesAmount = beneficiary.votesAmount ? beneficiary.votesAmount.toFixed(3) : '';
  const amount = beneficiary.amount ? beneficiary.amount.toFixed(3) : '';
  const totalHive = votesAmount + amount;
  const payableInDollars = beneficiary.payableInDollars
    ? `$ ${beneficiary.payableInDollars.toFixed(3)}`
    : '';

  return (
    <tr>
      <td>
        <div className="ReportTableRewardsRow__name">{beneficiary.account}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__weigth">{weight}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__hivePower">{votesAmount}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__hive">{amount}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalHive">{totalHive}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalUsd">{payableInDollars}</div>
      </td>
    </tr>
  );
};

export default ReportTableRewardsRow;
