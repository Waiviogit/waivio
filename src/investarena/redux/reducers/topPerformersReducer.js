import * as topPerformersTypes from '../actions/topPerformersActions';

const initialState = {
  loading: false,
  loaded: false,
  statistic: {
    d1: [],
    d7: [],
    m1: [],
    m3: [],
    m6: [],
    m12: [],
    m24: [],
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case topPerformersTypes.GET_PERFORMERS_STATS_START:
      return { ...state, loading: true };
    case topPerformersTypes.GET_PERFORMERS_STATS_SUCCESS:
      return {
        loading: false,
        loaded: true,
        statistic: action.payload,
      };
    case topPerformersTypes.GET_PERFORMERS_STATS_ERROR:
      return initialState;

    case topPerformersTypes.GET_PERFORMERS_STATS_MORE_SUCCESS:
      return {
        ...state,
        statistic: {
          ...state.statistic,
          [action.meta.period]: [...state.statistic[action.meta.period], ...action.payload],
        },
      };
    default:
      return state;
  }
};

export const getPerformersStatistic = state => state.statistic;

export const getPerformersStatisticLoading = state => state.loading;

export const getPerformersStatisticLoaded = state => state.loaded;
