import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router';
import PropTypes from 'prop-types';

import WalletTable from './WalletTable';
import {
  calculateTotalChangesInDetails,
  getMoreReportDetails,
  getReportDetails,
} from '../../../store/advancedReports/advancedActions';

const DetailsTable = props => {
  const { reportId } = useParams();

  const getTransactionList = () => props.getUserTableTransactions(reportId);
  const getMoreTransactionList = () => props.getMoreTableUserTransactionHistory(reportId);
  const calculateTotalChanges = (item, checked, currency) =>
    props.calculateTotalChangesInDetails(reportId, item, checked, currency);

  return (
    <WalletTable
      getMoreTableUserTransactionHistory={getMoreTransactionList}
      getUserTableTransactions={getTransactionList}
      calculateTotalChanges={calculateTotalChanges}
      withoutFilters
    />
  );
};

DetailsTable.propTypes = {
  getUserTableTransactions: PropTypes.func,
  getMoreTableUserTransactionHistory: PropTypes.func,
  calculateTotalChangesInDetails: PropTypes.func,
};

export default connect(null, {
  getMoreTableUserTransactionHistory: getMoreReportDetails,
  getUserTableTransactions: getReportDetails,
  calculateTotalChangesInDetails,
})(DetailsTable);
