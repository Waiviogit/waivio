import React from 'react';

const ReportTableFeesRow = fee => {
  const hive = fee.hive ? fee.hive.toFixed(3) : '';
  const usd = fee.usd ? fee.usd.toFixed(3) : '';
  return (
    <tr>
      <td>
        <div className="ReportTableFeesRow__name">{fee.name}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__account">{fee.account}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__share">{`${fee.share / 100}%`}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__hive">{hive}</div>
      </td>
      <td>
        <div className="ReportTableFeesRow__usd">{`$ ${usd}`}</div>
      </td>
    </tr>
  );
};

export default ReportTableFeesRow;
