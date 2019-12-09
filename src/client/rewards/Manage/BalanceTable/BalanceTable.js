import React from 'react';
import { FormattedNumber } from 'react-intl';
import PropTypes from 'prop-types';
import './BalanceTable.less';

const BalanceTable = props => {
  const { intl, budgetTotal, user } = props;
  const balance = parseFloat(user.balance);
  const payable = budgetTotal.sum_payable ? budgetTotal.sum_payable.toFixed(2) : '0.00';
  const reserved = budgetTotal.sum_reserved ? budgetTotal.sum_reserved.toFixed(2) : '0.00';
  const remaining = balance - payable - reserved;
  return (
    <table className="BalanceTable">
      <thead>
        <tr>
          <th>{intl.formatMessage({ id: 'balance', defaultMessage: `Balance` })}</th>
          <th>{intl.formatMessage({ id: 'payable', defaultMessage: `Payable` })}*</th>
          <th>{intl.formatMessage({ id: 'reserved', defaultMessage: `Reserved` })}</th>
          <th>{intl.formatMessage({ id: 'remaining', defaultMessage: `Remaining` })}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <FormattedNumber value={balance} />
          </td>
          <td>{payable}</td>
          <td>{reserved}</td>
          <td>{remaining}</td>
        </tr>
      </tbody>
    </table>
  );
};

BalanceTable.propTypes = {
  budgetTotal: PropTypes.shape(),
  user: PropTypes.shape(),
  intl: PropTypes.shape(),
};

BalanceTable.defaultProps = {
  budgetTotal: {},
  user: {},
  intl: {},
};

export default BalanceTable;
