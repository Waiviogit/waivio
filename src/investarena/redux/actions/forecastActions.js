import api from '../../configApi/apiResources';
import { createAsyncActionType } from '../../../client/helpers/stateHelpers';

export const GET_FORECAST_DATA = createAsyncActionType('@forecast-data/GET_FORECAST_DATA');

export const getActiveForecasts = ({ name, quote } = { name: '', quote: '' }) => dispatch =>
  dispatch({
    type: GET_FORECAST_DATA.ACTION,
    payload: api.forecasts.getActiveForecasts(name, quote),
  });
