import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import './ReportTableRewardsRow.less';

const ReportTableRewardsRow = beneficiary => {
  const weight = beneficiary.weight ? `${beneficiary.weight}%` : '';
  const votesAmount = beneficiary.votesAmount ? beneficiary.votesAmount.toFixed(3) : '';
  const amount = beneficiary.amount ? beneficiary.amount.toFixed(3) : '';
  const totalHive = Number(votesAmount) + Number(amount);
  const payableInDollars = beneficiary.payableInDollars
    ? `$ ${beneficiary.payableInDollars.toFixed(2)}`
    : '';
  const ReportTableClassesList = classNames('ReportTableRewardsRow__hive', {
    ReportTableRewardsRow__ownHive: beneficiary.ownHive,
  });

  return (
    <tr>
      <td>
        <div className="ReportTableRewardsRow__name">
          <Link to={`/@${beneficiary.account}`}>{beneficiary.account}</Link>
        </div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__weigth">{weight}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__hivePower">{votesAmount}</div>
      </td>
      <td>
        <div className={ReportTableClassesList}>{amount}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalHive">{totalHive.toFixed(3)}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalUsd">{payableInDollars}</div>
      </td>
    </tr>
  );
};

export default ReportTableRewardsRow;
