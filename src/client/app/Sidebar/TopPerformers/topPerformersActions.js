import * as api from '../../../../waivioApi/ApiClient';

export const GET_PERFORMERS_STATS = '@top-performers/GET_PERFORMERS_STATS';
export const GET_PERFORMERS_STATS_START = '@top-performers/GET_PERFORMERS_STATS_START';
export const GET_PERFORMERS_STATS_SUCCESS = '@top-performers/GET_PERFORMERS_STATS_SUCCESS';
export const GET_PERFORMERS_STATS_ERROR = '@top-performers/GET_PERFORMERS_STATS_ERROR';

export const getPerformersStatistic = () => dispatch =>
  dispatch({
    type: GET_PERFORMERS_STATS,
    payload: { promise: api.getPerformersStatistics() },
  });
