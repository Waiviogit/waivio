import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import './BalanceTable.less';

const BalanceTable = props => {
  const { intl, budgetTotal, isGuest, guestBalance } = props;
  const balance = budgetTotal.account_amount ? budgetTotal.account_amount.toFixed(3) : '0.000';
  const payable = budgetTotal.sum_payable ? budgetTotal.sum_payable.toFixed(3) : '0.000';
  const reserved = budgetTotal.sum_reserved ? budgetTotal.sum_reserved.toFixed(3) : '0.000';
  const remaining = budgetTotal.remaining ? budgetTotal.remaining.toFixed(3) : '0.000';

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
      {!isEmpty(budgetTotal) && (
        <tbody>
          <tr>
            <td>{isGuest ? guestBalance : balance}</td>
            <td>{payable}</td>
            <td>{reserved}</td>
            <td>{remaining}</td>
          </tr>
        </tbody>
      )}
    </table>
  );
};

BalanceTable.propTypes = {
  budgetTotal: PropTypes.shape(),
  intl: PropTypes.shape(),
  isGuest: PropTypes.bool,
  guestBalance: PropTypes.string,
};

BalanceTable.defaultProps = {
  budgetTotal: {},
  intl: {},
  isGuest: false,
  guestBalance: null,
};

export default BalanceTable;
