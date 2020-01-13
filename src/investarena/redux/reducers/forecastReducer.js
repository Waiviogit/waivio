import moment from 'moment';
import * as activeForecastTypes from '../actions/forecastActions';

const initialState = {
  forecastData: [],
  quickForecastData: [],
  userStatistics: [],
  winners: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case activeForecastTypes.GET_FORECAST_DATA.SUCCESS:
      return {
        ...state,
        forecastData: action.payload.forecasts
          .filter(f => moment(f.forecast) > moment())
          .sort((a, b) => moment(b.created_at).unix() - moment(a.created_at).unix()), // eslint-disable-line
      };

    case activeForecastTypes.GET_FORECAST_DATA.ERROR:
      return {
        ...state,
        forecastData: [],
      };

    case activeForecastTypes.GET_QUICK_FORECAST_DATA:

      return {
        ...state,
        quickForecastData: [...action.payload],
      };

    case activeForecastTypes.ANSWER_QUICK_FORECAST:
      return {
        ...state,
      };

    case activeForecastTypes.GET_QUICK_FORECAST_STATISTIC.SUCCESS:
      return {
        ...state,
        userStatistics: [...state.userStatistics, ...action.payload],
      };

    case activeForecastTypes.GET_QUICK_FORECAST_STATISTIC.ERROR:
      return {
        ...state,
        userStatistics: [],
      };

    default:
      return state;
  }
};

export const getForecastData = state => state.forecastData;
