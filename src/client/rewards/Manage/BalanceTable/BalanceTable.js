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
          <th>{intl.formatMessage({ id: 'Payable', defaultMessage: `Payable*` })}</th>
          <th>{intl.formatMessage({ id: 'Reserved', defaultMessage: `Reserved` })}</th>
          <th>{intl.formatMessage({ id: 'Remaining', defaultMessage: `Remaining**` })}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{budgetTotal.sum_budget}</td>
          <td>{budgetTotal.sum_payable}</td>
          <td>{budgetTotal.sum_reserved}</td>
          <td>{budgetTotal.remaining}</td>
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
