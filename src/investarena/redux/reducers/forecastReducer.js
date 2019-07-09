import moment from 'moment';
import * as activeForecastTypes from '../actions/forecastActions';

const initialState = {
  forecastData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case activeForecastTypes.GET_FORECAST_DATA.SUCCESS:
      return {
        ...state,
        forecastData: action.payload.forecasts.sort(
          (a, b) => moment(b.created_at).unix() - moment(a.created_at).unix(),
        ), // eslint-disable-line
      };
    case activeForecastTypes.GET_FORECAST_DATA.ERROR:
      return {
        ...state,
        forecastData: [],
      };

    default:
      return state;
  }
};

export const getForecastData = state => state.forecastData;
export const getForecastDataByUser = (state, userName) =>
  state.forecastData.filter(forecast => forecast.author === userName);
export const getForecastDataByQuote = (state, quote) =>
  state.forecastData.filter(forecast => forecast.security.toLowerCase() === quote);
