import * as topPerformersTypes from '../actions/topPerformersActions';

const initialState = {
  loading: false,
  loaded: false,
  compareWith: [],
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
        compareWith: { ...state.compareWith },
        statistic: action.payload,
      };
    case topPerformersTypes.GET_PERFORMERS_STATS_ERROR:
      return initialState;
    default:
      return state;
  }
};

export const getPerformersStatistic = state => state.statistic;

export const getPerformersStatisticLoading = state => state.loading;

export const getPerformersStatisticLoaded = state => state.loaded;
