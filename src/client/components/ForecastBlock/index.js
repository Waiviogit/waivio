import { connect } from 'react-redux';
import React from 'react';
import ForecastBlock from './ForecastBlock';
import { getActiveForecasts } from '../../../investarena/redux/actions/forecastActions';
import { getForecastData } from '../../reducers';

const ForecastBlockContainer = props => <ForecastBlock {...props} />;

const mapState = () => state => ({
  forecasts: getForecastData(state),
});

function mapDispatchToProps(dispatch, ownProps) {
  return {
    getActiveForecastsByUser: () => dispatch(getActiveForecasts({ name: ownProps.username })),
    getActiveForecastsByObject: () =>
      dispatch(getActiveForecasts({ quote: ownProps.quoteSecurity })),
  };
}

export default connect(mapState, mapDispatchToProps)(ForecastBlockContainer);
