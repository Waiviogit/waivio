import { connect } from 'react-redux';
import React from 'react';
import {
  getIsConnectPlatformState,
  getPlatformNameState,
} from '../../redux/selectors/platformSelectors';
import { getChartData } from '../../redux/actions/chartsActions';
import { makeGetChartState } from '../../redux/selectors/chartsSelectors';
import { makeGetQuoteSettingsState } from '../../redux/selectors/quotesSettingsSelectors';
import { makeGetQuoteState } from '../../redux/selectors/quotesSelectors';
import PostChart from './PostChart';
import {toggleModal} from "../../redux/actions/modalsActions";

const PostChartContainer = props => <PostChart {...props} />;

const mapState = () => {
  const getQuoteState = makeGetQuoteState();
  const getQuoteSettingsState = makeGetQuoteSettingsState();
  const getChartState = makeGetChartState();
  return (state, ownProps) => {
    return {
      bars: getChartState(state, ownProps),
      quote: getQuoteState(state, ownProps),
      quoteSettings: getQuoteSettingsState(state, ownProps),
      connect: getIsConnectPlatformState(state),
      platformName: getPlatformNameState(state),
    };
  };
};

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getChartData: timeScale => dispatch(getChartData(ownProps.quoteSecurity, timeScale)),
    toggleModal: (name, data) => dispatch(toggleModal(name, data)),
  };
}

export default connect(
  mapState,
  mapDispatchToProps,
)(PostChartContainer);
