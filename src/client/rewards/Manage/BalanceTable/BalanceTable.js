import React from 'react';
import PropTypes from 'prop-types';
import './BalanceTable.less';

const BalanceTable = props => {
  const { intl, budgetTotal } = props;
  return (
    <table className="BalanceTable">
      <thead>
        <tr>
          <th>{intl.formatMessage({ id: 'balanace', defaultMessage: `Balanace` })}</th>
          <th>{intl.formatMessage({ id: 'payable', defaultMessage: `Payable` })}*</th>
          <th>{intl.formatMessage({ id: 'reserved', defaultMessage: `Reserved` })}</th>
          <th>{intl.formatMessage({ id: 'remaining', defaultMessage: `Remaining` })}**</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{budgetTotal.sum_budget ? budgetTotal.sum_budget.toFixed(2) : '0.00'}</td>
          <td>{budgetTotal.sum_payable ? budgetTotal.sum_payable.toFixed(2) : '0.00'}</td>
          <td>{budgetTotal.sum_reserved ? budgetTotal.sum_reserved.toFixed(2) : '0.00'}</td>
          <td>{budgetTotal.remaining ? budgetTotal.remaining.toFixed(2) : '0.00'}</td>
        </tr>
      </tbody>
    </table>
  );
};

BalanceTable.propTypes = {
  budgetTotal: PropTypes.shape(),
  intl: PropTypes.shape(),
};

BalanceTable.defaultProps = {
  budgetTotal: {},
  intl: {},
};

export default BalanceTable;
