import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import { getIsConnectPlatformState, getPlatformNameState } from '../../redux/selectors/platformSelectors';
import DealsPage from './DealsPage';
import { getQuotesSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { getQuotesState } from '../../redux/selectors/quotesSelectors';

const propTypes = {
    quotes: PropTypes.object.isRequired,
    quoteSettings: PropTypes.object.isRequired,
    platformConnect: PropTypes.bool.isRequired,
    platformName: PropTypes.string.isRequired
};

const DealsPageContainer = (props) => <DealsPage {...props} />;

DealsPageContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        quotes: getQuotesState(state),
        quoteSettings: getQuotesSettingsState(state),
        platformConnect: getIsConnectPlatformState(state),
        platformName: getPlatformNameState(state),
    };
}

export default connect(mapStateToProps)(DealsPageContainer);
