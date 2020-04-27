import React from 'react';
// import PropTypes from 'prop-types';

const ReportTableFeesRow = fee => (
  <tr>
    <td>
      <div className="ReportTableFeesRow__name">{fee.name}</div>
    </td>
    <td>
      <div className="ReportTableFeesRow__account">{fee.account}</div>
    </td>
    <td>
      <div className="ReportTableFeesRow__share">{`${fee.share}%`}</div>
    </td>
    <td>
      <div className="ReportTableFeesRow__hive">{fee.hive}</div>
    </td>
    <td>
      <div className="ReportTableFeesRow__usd">{`$ ${fee.usd}`}</div>
    </td>
  </tr>
);

ReportTableFeesRow.propTypes = {
  // fee: PropTypes.shape().isRequired,
};

export default ReportTableFeesRow;
