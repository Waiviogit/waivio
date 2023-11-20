import React from 'react';
import { Link } from 'react-router-dom';
import { round } from 'lodash';
import USDDisplay from '../../../../components/Utils/USDDisplay';

const ReportTableFeesRow = fee => {
  const hive = fee.hive ? round(fee.hive, 3) : '';
  const usd = fee.usd ? round(fee.usd, 2) : '';
  const share = fee.share ? `${round(fee.share / 100, 2)}%` : '';

  return (
    <tr>
      <td>
        <div className="ReportTableFeesRow__name">{fee.name}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__account">
          <Link to={`/@${fee.account}`}>{fee.account}</Link>
        </div>
      </td>
      <td>
        <div className="ReportTableFeesRow__share">{share}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__hive">{hive}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__usd">
          <USDDisplay value={usd} currencyDisplay="symbol" />
        </div>
      </td>
    </tr>
  );
};

export default ReportTableFeesRow;
