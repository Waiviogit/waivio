import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';
import { getClosedDealsState } from '../../../../redux/selectors/dealsSelectors';
import { getQuotesSettingsState } from '../../../../redux/selectors/quotesSettingsSelectors';
import ClosedDeals from './ClosedDeals';

const propTypes = {
    quotesSettings: PropTypes.object,
    closedDeals: PropTypes.object.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

const ClosedDealsContainer = (props) => <ClosedDeals {...props}/>;

ClosedDealsContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        closedDeals: getClosedDealsState(state),
        quotesSettings: getQuotesSettingsState(state)
    };
}

export default connect(mapStateToProps)(ClosedDealsContainer);
