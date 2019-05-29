// import * as api from '../../../waivioApi/ApiClient';
// import { createAsyncActionType } from '../../../helpers/stateHelpers';
import api from '../../configApi/apiResources';

export const GET_PERFORMERS_STATS = '@top-performers/GET_PERFORMERS_STATS';
export const GET_PERFORMERS_STATS_START = '@top-performers/GET_PERFORMERS_STATS_START';
export const GET_PERFORMERS_STATS_SUCCESS = '@top-performers/GET_PERFORMERS_STATS_SUCCESS';
export const GET_PERFORMERS_STATS_ERROR = '@top-performers/GET_PERFORMERS_STATS_ERROR';

export const getPerformersStatistic = () => dispatch =>
  dispatch({
    type: GET_PERFORMERS_STATS,
    payload: {
      promise: api.performers.getPerformersStatistics()
    }
  });

// export const SEARCH_INSTRUMENTS_STAT = createAsyncActionType('@top-performers/SEARCH_INSTRUMENTS_STAT');
//
// export const searchInstrumentsStat = searchString => dispatch =>
//   dispatch({
//     type: SEARCH_INSTRUMENTS_STAT.ACTION,
//     payload: {
//       promise: ApiClient.searchInstrumentsStat(searchString).then(result => ({
//         result,
//         search: searchString,
//       })),
//     },
//   });
