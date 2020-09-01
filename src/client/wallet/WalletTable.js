import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, map } from 'lodash';
import './WalletTable.less';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getTransactions,
  getUser,
  getUsersTransactions,
} from '../reducers';
import { getDataDemoTransactions } from './WalletHelper';
import WalletTableBodyRow from './WalletTableBodyRow';
import { guestUserRegex } from '../helpers/regexHelpers';
import * as store from '../reducers';

const getCurrentTransactions = (props, isGuestPage) => {
  const { user, transactionsHistory, demoTransactionsHistory } = props;
  const username = user.name;
  const transactions = get(transactionsHistory, username, []);
  const demoTransactions = getDataDemoTransactions(username, demoTransactionsHistory);
  return isGuestPage ? demoTransactions : transactions;
};

const WalletTable = props => {
  const { user, intl, authUserName, totalVestingShares, totalVestingFundSteem } = props;
  const isGuestPage = guestUserRegex.test(user && user.name);
  const transactions = getCurrentTransactions(props, isGuestPage);
  const currentUsername = user.name;
  return (
    <React.Fragment>
      <table className="WalletTable">
        <thead>
          <tr>
            <th className="WalletTable__date">
              {intl.formatMessage({
                id: 'table_date',
                defaultMessage: `Date`,
              })}
            </th>
            <th className="WalletTable__HIVE">
              {intl.formatMessage({
                id: 'table_HIVE',
                defaultMessage: `HIVE`,
              })}
            </th>
            <th className="WalletTable__HP">
              {intl.formatMessage({
                id: 'table_HP',
                defaultMessage: `HP`,
              })}
            </th>
            <th className="WalletTable__HBD">
              {intl.formatMessage({
                id: 'table_HBD',
                defaultMessage: `HBD`,
              })}
            </th>
            <th className="WalletTable__description">
              {intl.formatMessage({
                id: 'table_description',
                defaultMessage: `Description`,
              })}
            </th>
            <th className="WalletTable__memo">
              {intl.formatMessage({
                id: 'table_memo',
                defaultMessage: `Memo`,
              })}
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions &&
            map(transactions, transaction => (
              <WalletTableBodyRow
                key={transaction.timestamp}
                transaction={transaction}
                isGuestPage={isGuestPage}
                currentUsername={currentUsername}
                authUserName={authUserName}
                totalVestingShares={totalVestingShares}
                totalVestingFundSteem={totalVestingFundSteem}
              />
            ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

WalletTable.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
  authUserName: PropTypes.string,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

WalletTable.defaultProps = {
  authUserName: '',
  transactionsHistory: {},
  demoTransactionsHistory: {},
};

const mapStateToProps = (state, ownProps) => ({
  user:
    ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
  authUserName: store.getAuthenticatedUserName(state),
  transactionsHistory: getTransactions(state),
  demoTransactionsHistory: getUsersTransactions(state),
  totalVestingShares: getTotalVestingShares(state),
  totalVestingFundSteem: getTotalVestingFundSteem(state),
});
export default connect(mapStateToProps, {})(injectIntl(WalletTable));
