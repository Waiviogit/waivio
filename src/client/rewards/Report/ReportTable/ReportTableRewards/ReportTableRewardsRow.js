import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { get, round } from 'lodash';
import USDDisplay from '../../../../components/Utils/USDDisplay';
import './ReportTableRewardsRow.less';

const ReportTableRewardsRow = beneficiary => {
  const votesAmount = round(get(beneficiary, 'votesAmount', 0), 3);
  const precition = beneficiary.payoutToken === 'WAIV' ? 5 : 3;
  const amount = round(get(beneficiary, 'amount', 0), precition);
  const totalHive = Number(votesAmount) + Number(amount);
  const payableInDollars = round(get(beneficiary, 'payableInDollars', 0), 2);
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
        <div className="ReportTableRewardsRow__weigth">{beneficiary.weight}%</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__hivePower">{votesAmount}</div>
      </td>
      <td>
        <div className={ReportTableClassesList}>{amount}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalHive">{round(totalHive, 3)}</div>
      </td>
      <td>
        <div className="ReportTableRewardsRow__totalUsd">
          <USDDisplay value={payableInDollars} currencyDisplay="symbol" />
        </div>
      </td>
    </tr>
  );
};

export default ReportTableRewardsRow;
