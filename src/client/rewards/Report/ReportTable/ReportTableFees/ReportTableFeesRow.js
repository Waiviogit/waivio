import React from 'react';
import { Link } from 'react-router-dom';

const ReportTableFeesRow = fee => {
  const hive = fee.hive ? fee.hive.toFixed(3) : '';
  const usd = fee.usd ? `$ ${fee.usd.toFixed(2)}` : '';
  const share = fee.share ? `${(fee.share / 100).toFixed(2)}%` : '';

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
        <div className="ReportTableFeesRow__usd">{usd}</div>
      </td>
    </tr>
  );
};

export default ReportTableFeesRow;
