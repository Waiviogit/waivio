import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty, round, get } from 'lodash';
import './BalanceTable.less';

const BalanceTable = props => {
  const { intl, budgetTotal, isGuest, guestBalance } = props;
  const balance = round(get(budgetTotal, 'account_amount', 0), 3);
  const payable = round(get(budgetTotal, 'sum_payable', 0), 3);
  const reserved = round(get(budgetTotal, 'sum_reserved', 0), 3);
  const remaining = round(get(budgetTotal, 'remaining', 0), 3);

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
