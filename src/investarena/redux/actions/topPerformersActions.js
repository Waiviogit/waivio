import api from '../../configApi/apiResources';

export const GET_PERFORMERS_STATS = '@top-performers/GET_PERFORMERS_STATS';
export const GET_PERFORMERS_STATS_START = '@top-performers/GET_PERFORMERS_STATS_START';
export const GET_PERFORMERS_STATS_SUCCESS = '@top-performers/GET_PERFORMERS_STATS_SUCCESS';
export const GET_PERFORMERS_STATS_ERROR = '@top-performers/GET_PERFORMERS_STATS_ERROR';

export const getPerformersStatistic = () => dispatch =>
  dispatch({
    type: GET_PERFORMERS_STATS,
    payload: {
      promise: api.performers.getPerformersStatistics(),
    },
  });

export const GET_PERFORMERS_STATS_MORE = '@top-performers/GET_PERFORMERS_STATS_MORE';
export const GET_PERFORMERS_STATS_MORE_START = '@top-performers/GET_PERFORMERS_STATS_MORE_START';
export const GET_PERFORMERS_STATS_MORE_SUCCESS =
  '@top-performers/GET_PERFORMERS_STATS_MORE_SUCCESS';
export const GET_PERFORMERS_STATS_MORE_ERROR = '@top-performers/GET_PERFORMERS_STATS_MORE_ERROR';

export const getPerformersStatsMore = (period, limit, skip) => dispatch =>
  dispatch({
    type: GET_PERFORMERS_STATS_MORE,
    payload: {
      promise: api.performers.getPerformersStatisticsForPeriod(period, limit, skip),
    },
    meta: { period },
  });
