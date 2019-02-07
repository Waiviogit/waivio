import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getOpenDealsState } from '../../../redux/selectors/dealsSelectors';
import { getQuotesSettingsState } from '../../../redux/selectors/quotesSettingsSelectors';
import { getQuotesState } from '../../../redux/selectors/quotesSelectors';
import OpenDeals from './OpenDeals';

const propTypes = {
  openDeals: PropTypes.object.isRequired,
  quotes: PropTypes.object.isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards']),
  quoteSettings: PropTypes.object.isRequired,
};

const OpenDealsContainer = props => <OpenDeals {...props} />;

OpenDealsContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    openDeals: getOpenDealsState(state),
    quoteSettings: getQuotesSettingsState(state),
    quotes: getQuotesState(state),
  };
}

export default connect(mapStateToProps)(OpenDealsContainer);
