import { connect } from 'react-redux';
import React from 'react';
import { getClosedDealsState } from '../../../redux/selectors/dealsSelectors';
import { getQuotesSettingsState } from '../../../redux/selectors/quotesSettingsSelectors';
import ClosedDeals from './ClosedDeals';

const ClosedDealsContainer = props => <ClosedDeals {...props} />;

function mapStateToProps(state) {
  return {
    closedDeals: getClosedDealsState(state),
    quotesSettings: getQuotesSettingsState(state),
  };
}

export default connect(mapStateToProps)(ClosedDealsContainer);
