import { message } from 'antd';
import { get } from 'lodash';
import api from '../../configApi/apiResources';
import createFormatter from '../../../client/helpers/steemitFormatter';
import { createAsyncActionType } from '../../../client/helpers/stateHelpers';
import { getAuthenticatedUserName } from '../../../client/reducers';
import { forecastComments } from '../../constants/constantsForecast';

export const GET_FORECAST_DATA = createAsyncActionType('@forecast-data/GET_FORECAST_DATA');

export const GET_QUICK_FORECAST_DATA = createAsyncActionType(
  '@forecast-data/GET_QUICK_FORECAST_DATA',
);
export const GET_QUICK_FORECAST_STATISTIC = createAsyncActionType(
  '@forecast-data/GET_QUICK_FORECAST_STATISTIC',
);
export const GET_QUICK_FORECAST_WINNERS = createAsyncActionType(
  '@forecast-data/GET_QUICK_FORECAST_WINNERS',
);
export const GET_QUICK_FORECAST_REWARDS = createAsyncActionType(
  '@forecast-data/GET_QUICK_FORECAST_REWARDS',
);

export const ANSWER_QUICK_FORECAST = '@forecast-data/ANSWER_QUICK_FORECAST';
export const ANSWER_QUICK_LOADING = '@forecast-data/ANSWER_QUICK_LOADING';
export const ANSWER_QUICK_ERROR = '@forecast-data/ANSWER_QUICK_ERROR';
export const FINISH_QUICK_FORECAST = '@forecast-data/FINISH_QUICK_FORECAST';
export const ANSWER_QUICK_FORECAST_LIKE_POST = '@forecast-data/ANSWER_QUICK_FORECAST_LIKE_POST';
export const ANSWER_QUICK_FORECAST_SEND_COMMENT =
  '@forecast-data/ANSWER_QUICK_FORECAST_SEND_COMMENT';

export const getActiveForecasts = ({ name, quote } = { name: '', quote: '' }) => dispatch =>
  dispatch({
    type: GET_FORECAST_DATA.ACTION,
    payload: api.forecasts.getActiveForecasts(name, quote),
  });

export const getDataForQuickForecast = () => (dispatch, getState) => {
  const username = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_QUICK_FORECAST_DATA.ACTION,
    payload: api.quickForecast.getQuickForecast(username),
  });
};

export const getForecastStatistic = () => (dispatch, getState) => {
  const username = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_QUICK_FORECAST_STATISTIC.ACTION,
    payload: api.quickForecast.getQuickForecastStatistics(username),
  });
};

export const getForecastWinners = (limit, skip) => (dispatch, getState) => {
  const user = getAuthenticatedUserName(getState());

  dispatch({
    type: GET_QUICK_FORECAST_WINNERS.ACTION,
    payload: api.quickForecast.getQuickForecastWinners(user, limit, skip),
  });
};

export const getForecastRoundRewards = () => dispatch => {
  dispatch({
    type: GET_QUICK_FORECAST_REWARDS.ACTION,
    payload: api.quickForecast.getQuickForecastRewards(),
  });
};

export const answerForQuickForecast = (
  author,
  permlink,
  expiredAt,
  answer,
  id,
  security,
  timerData,
  counter,
  weight = 10000,
) => (dispatch, getState, { steemConnectAPI }) => {
  const arrayRandElement = arr => {
    const rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
  };

  const username = getAuthenticatedUserName(getState());
  const postPrice = get(getState(), ['quotes', security, 'bidPrice'], null);
  const forecastObject = get(getState(), ['quotesSettings', security, 'name'], null);
  const commentArray = forecastComments(forecastObject);
  const comment = arrayRandElement(commentArray);

  dispatch({
    type: ANSWER_QUICK_LOADING,
    payload: id,
  });

  if (Date.parse(expiredAt) > Date.now()) {
    dispatch({
      type: ANSWER_QUICK_FORECAST_LIKE_POST,
      payload: {
        promise: new Promise((resolve, reject) =>
          steemConnectAPI
            .vote(username, author, permlink, weight)
            .then(() => {
              dispatch({
                type: ANSWER_QUICK_FORECAST_SEND_COMMENT,
                payload: {
                  promise: steemConnectAPI
                    .broadcast([
                      [
                        'comment',
                        {
                          parent_author: author,
                          parent_permlink: permlink,
                          author: username,
                          permlink: createFormatter.commentPermlink(author, permlink),
                          title: 'unactivate topic for rewards',
                          body: comment,
                          json_metadata: JSON.stringify({
                            forecast_comment: {
                              side: answer,
                              postPrice,
                              security,
                            },
                          }),
                        },
                      ],
                    ])
                    .then(() => {
                      message.success(`You still have ${5 - counter - 1} forecasts `);
                      dispatch({
                        type: ANSWER_QUICK_FORECAST,
                        payload: {
                          answer,
                          id,
                          postPrice,
                          quickForecastExpiredAt: Date.now() + timerData,
                        },
                      });
                    })
                    .catch(error => {
                      reject(error);
                      dispatch({
                        type: ANSWER_QUICK_ERROR,
                        payload: {
                          id,
                        },
                      });
                    }),
                },
              });
            })
            .catch(e => {
              reject(e);
              dispatch({
                type: ANSWER_QUICK_ERROR,
                payload: {
                  id,
                },
              });
            }),
        ),
      },
    });
  }
};
