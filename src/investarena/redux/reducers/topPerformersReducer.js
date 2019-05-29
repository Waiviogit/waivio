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
    // get initial list of performers
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

      // get instrument to compare
    case topPerformersTypes.GET_INSTRUMENT_STAT_SUCCESS:
      return {
        ...state,
        compareWith: action.payload,
      };
    case topPerformersTypes.GET_INSTRUMENT_STAT_ERROR:
      return {
        ...state,
        compareWith: null,
      };
    default:
      return state;
  }
};

export const getPerformersStatistic = state => state.statistic;

export const getInstrumentToCompare = state => state.compareWith;

export const getPerformersStatisticLoading = state => state.loading;

export const getPerformersStatisticLoaded = state => state.loaded;
