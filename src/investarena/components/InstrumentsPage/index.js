import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getAssetsChartsState } from '../../redux/selectors/chartsSelectors';
import { getChartsData } from '../../redux/actions/chartsActions';
import {getFavoritesState} from '../../redux/selectors/favoriteQuotesSelectors';
import {getIsConnectPlatformState} from '../../redux/selectors/platformSelectors';
import { getOpenDealsState } from '../../redux/selectors/dealsSelectors';
import {getQuotesSettingsState} from '../../redux/selectors/quotesSettingsSelectors';
import {getQuotesState} from '../../redux/selectors/quotesSelectors';
import InstrumentsPage from './InstrumentsPage';

const propTypes = {
    charts: PropTypes.object,
    openDeals: PropTypes.object,
    favorites: PropTypes.array.isRequired,
    quotes: PropTypes.object.isRequired,
    quoteSettings: PropTypes.object.isRequired,
    platformConnect: PropTypes.bool.isRequired,
    getChartsData: PropTypes.func.isRequired,
};

const InstrumentsPageContainer = (props) => <InstrumentsPage {...props} />;

InstrumentsPageContainer.propTypes = propTypes;

function mapStateToProps (state) {
    return {
        quotes: getQuotesState(state),
        quoteSettings: getQuotesSettingsState(state),
        favorites: getFavoritesState(state),
        platformConnect: getIsConnectPlatformState(state),
        openDeals: getOpenDealsState(state),
        charts: getAssetsChartsState(state),
    };
}

function mapDispatchToProps (dispatch) {
    return ({
        getChartsData: () => dispatch(getChartsData()),
    });
}

export default connect(mapStateToProps, mapDispatchToProps)(InstrumentsPageContainer);
