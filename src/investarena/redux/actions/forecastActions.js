import api from '../../configApi/apiResources';
import createFormatter from '../../../client/helpers/steemitFormatter';
import {createAsyncActionType} from '../../../client/helpers/stateHelpers';
import {getAuthenticatedUserName} from "../../../client/reducers";

export const GET_FORECAST_DATA = createAsyncActionType('@forecast-data/GET_FORECAST_DATA');

export const GET_QUICK_FORECAST_DATA = '@forecast-data/GET_QUICK_FORECAST_DATA';
export const GET_QUICK_FORECAST_STATISTIC = createAsyncActionType('@forecast-data/GET_QUICK_FORECAST_STATISTIC');
export const GET_QUICK_FORECAST_WINNERS = '@forecast-data/GET_QUICK_FORECAST_WINNERS';
export const ANSWER_QUICK_FORECAST = '@forecast-data/ANSWER_QUICK_FORECAST';
export const ANSWER_QUICK_FORECAST_LIKE_POST = '@forecast-data/ANSWER_QUICK_FORECAST_LIKE_POST';
export const ANSWER_QUICK_FORECAST_SEND_COMMENT = '@forecast-data/ANSWER_QUICK_FORECAST_SEND_COMMENT';


export const getActiveForecasts = ({name, quote} = {name: '', quote: ''}) => dispatch =>
  dispatch({
    type: GET_FORECAST_DATA.ACTION,
    payload: api.forecasts.getActiveForecasts(name, quote),
  });

export const getDataForQuickForecast = payload => (dispatch, getState) => {
  const username = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_QUICK_FORECAST_DATA,
    payload: payload || api.forecasts.getQuickForecast(username),
  });
};

export const getForecastStatistic = (payload, limit, skip) => dispatch => {
  dispatch({
    type: GET_QUICK_FORECAST_STATISTIC.ACTION,
    payload: payload ||  api.forecasts.getQuickForecastStatistics(limit, skip),
  });
};

export const getForecastWinners = (payload, limit, skip) => dispatch => {
  dispatch({
    type: GET_QUICK_FORECAST_WINNERS,
    payload: payload ||  api.forecasts.getQuickForecastStatistics(limit, skip),
  });
};

export const answerForQuickForecast = (author, permlink, answer, weight = 10000) => (dispatch, getState, {steemConnectAPI}) => {
  const username = getAuthenticatedUserName(getState());

  dispatch({
    type: ANSWER_QUICK_FORECAST_LIKE_POST,
    payload: {
      promise: steemConnectAPI
        .vote(username, author, permlink, weight)
        .then(res => {
          if (window.analytics) {
            window.analytics.track('Vote', {
              category: 'vote',
              label: 'submit',
              value: 1,
            });
          }

          return res;
        }),
    }
  });

  dispatch({
    type: ANSWER_QUICK_FORECAST_SEND_COMMENT,
    payload: {
      promise: new Promise((resolve, reject) =>
        steemConnectAPI
          .broadcast([['comment',
            {
              parent_author: author,
              parent_permlink: permlink,
              author: username,
              permlink: createFormatter.commentPermlink(author, permlink),
              title: 'unactivate topic for rewards',
              body: `Campaign was inactivated by '${username}' `,
              json_metadata: JSON.stringify({
                forecast_comment: {
                  forecast_author: author,
                  forecast_permlink: permlink,
                  side: answer,
                }
              }),
            },
          ]])
          .then(() => resolve('SUCCESS'))
          .catch(error => reject(error)))
    }
  })
};
