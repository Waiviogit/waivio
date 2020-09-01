import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, map } from 'lodash';
import './WalletTable.less';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
  getTransactions,
  getUser,
  getUsersTransactions,
  isGuestUser,
} from '../reducers';
import { getDataDemoTransactions } from './WalletHelper';
import WalletTableBodyRow from './WalletTableBodyRow';
import { guestUserRegex } from '../helpers/regexHelpers';

const getCurrentTransactions = (props, isGuestPage) => {
  const { user, transactionsHistory, demoTransactionsHistory } = props;
  const username = user.name;
  const transactions = get(transactionsHistory, username, []);
  const demoTransactions = getDataDemoTransactions(username, demoTransactionsHistory);
  return isGuestPage ? demoTransactions : transactions;
};

const WalletTable = props => {
  const { user, intl } = props;
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
};

WalletTable.defaultProps = {
  transactionsHistory: {},
  demoTransactionsHistory: {},
};

const mapStateToProps = (state, ownProps) => ({
  user:
    ownProps.isCurrentUser || ownProps.match.params.name === getAuthenticatedUserName(state)
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
  isGuest: isGuestUser(state),
  transactionsHistory: getTransactions(state),
  demoTransactionsHistory: getUsersTransactions(state),
});
export default connect(mapStateToProps, {})(injectIntl(WalletTable));
