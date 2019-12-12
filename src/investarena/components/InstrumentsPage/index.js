import React from 'react';
import { connect } from 'react-redux';
import { getAssetsChartsState } from '../../redux/selectors/chartsSelectors';
import { getChartsData } from '../../redux/actions/chartsActions';
import { getIsConnectPlatformState } from '../../redux/selectors/platformSelectors';
import { getOpenDealsState } from '../../redux/selectors/dealsSelectors';
import { getQuotesSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import InstrumentsPage from './InstrumentsPage';
import { getScreenSize } from '../../../client/reducers';

const InstrumentsPageContainer = props => <InstrumentsPage {...props} />;

function mapStateToProps(state) {
  return {
    quoteSettings: getQuotesSettingsState(state),
    platformConnect: getIsConnectPlatformState(state),
    openDeals: getOpenDealsState(state),
    charts: getAssetsChartsState(state),
    screenSize: getScreenSize(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getChartsData: () => dispatch(getChartsData()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(InstrumentsPageContainer);
