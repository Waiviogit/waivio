import api from '../../configApi/apiResources';

export const GET_FORECAST_DATA = '@forecast-data/GET_FORECAST_DATA';
export const GET_FORECAST_DATA_START = '@forecast-data/GET_FORECAST_DATA_START';
export const GET_FORECAST_DATA_SUCCESS = '@forecast-data/GET_FORECAST_DATA_SUCCESS';
export const GET_FORECAST_DATA_ERROR = '@forecast-data/GET_FORECAST_DATA_ERROR';

export const getActiveForecasts = () => dispatch =>
  dispatch({
    type: GET_FORECAST_DATA,
    payload: api.forecasts.getActiveForecasts(),
  });
