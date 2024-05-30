import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import WalletTable from './WalletTable';
import {
  calculateTotalChanges,
  getMoreTableUserTransactionHistory,
  getUserTableTransactions,
} from '../../../store/advancedReports/advancedActions';

const BothWalletTable = props => (
  <WalletTable
    getUserTableTransactions={props.getUserTableTransactions}
    getMoreTableUserTransactionHistory={props.getMoreTableUserTransactionHistory}
    calculateTotalChanges={props.calculateTotalChanges}
  />
);

BothWalletTable.propTypes = {
  getUserTableTransactions: PropTypes.func,
  getMoreTableUserTransactionHistory: PropTypes.func,
  calculateTotalChanges: PropTypes.func,
};

export default connect(null, {
  getUserTableTransactions,
  getMoreTableUserTransactionHistory,
  calculateTotalChanges,
})(BothWalletTable);
