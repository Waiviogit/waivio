import { connect } from 'react-redux';
import React from 'react';
import ForecastBlock from './ForecastBlock';
import { getActiveForecasts } from '../../../../investarena/redux/actions/forecastActions';
import { getForecastDataByUser } from '../../../reducers';

const ForecastBlockContainer = props => <ForecastBlock {...props} />;

const mapState = () => (state, ownProps) => ({
  forecasts: getForecastDataByUser(state, ownProps.username),
});

function mapDispatchToProps(dispatch) {
  return {
    getActiveForecasts: () => dispatch(getActiveForecasts()),
  };
}

export default connect(
  mapState,
  mapDispatchToProps,
)(ForecastBlockContainer);
