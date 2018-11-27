import apiCharts from '../../configApi/apiExtra';
import { singleton } from '../../platform/singletonPlatform';

export const GET_CHART_DATA_REQUEST = 'GET_CHART_DATA';
export const GET_CHART_DATA_SUCCESS = 'GET_CHART_DATA_SUCCESS';
export const GET_CHARTS_DATA_SUCCESS = 'GET_CHARTS_DATA_SUCCESS';

export function getChartData(quoteSecurity, timeScale) {
  return dispatch => {
    singleton.platform.getChartData(quoteSecurity, timeScale);
    dispatch(getChartDataRequest());
  };
}
export function getChartsData() {
  return dispatch => {
    return apiCharts.charts.getChartsData().then(response => {
      if (response) {
        dispatch(getChartsDataSuccess(response));
      }
    });
  };
}

export function getChartDataRequest() {
  return { type: GET_CHART_DATA_REQUEST };
}
export function getChartsDataSuccess(data) {
  return { type: GET_CHARTS_DATA_SUCCESS, payload: data };
}
export function getChartDataSuccess(data) {
  return { type: GET_CHART_DATA_SUCCESS, payload: data };
}
