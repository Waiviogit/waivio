import api from '../../configApi/apiResources';
import {createAsyncActionType} from '../../../client/helpers/stateHelpers';
import {getAuthenticatedUserName} from "../../../client/reducers";

export const GET_FORECAST_DATA = createAsyncActionType('@forecast-data/GET_FORECAST_DATA');

export const GET_QUICK_FORECAST_DATA = '@forecast-data/GET_QUICK_FORECAST_DATA';
export const ANSWER_QUICK_FORECAST = '@forecast-data/ANSWER_QUICK_FORECAST';

export const getActiveForecasts = ({name, quote} = {name: '', quote: ''}) => dispatch =>
  dispatch({
    type: GET_FORECAST_DATA.ACTION,
    payload: api.forecasts.getActiveForecasts(name, quote),
  });

export const getDataForQuickForecast = () => () => {
  console.log('mouted');
  // dispatch({
  //   type: GET_QUICK_FORECAST_DATA,
  //   // payload: api.forecast.getQuickForecast(),
  // });
};


export const answerForQuickForecast = () => (dispatch, getState, {steemConnectAPI}) => {
  const username = getAuthenticatedUserName(getState());

  const commentOp = [
    'comment',
    {
      parent_author: username,
      parent_permlink: 'company.activation_permlink',
      author: username,
      permlink: 'inactivatePermlink',
      title: 'unactivate topic for rewards',
      body: `Campaign was inactivated by '${username}' `,
      json_metadata: JSON.stringify({
        // eslint-disable-next-line no-underscore-dangle
        waivioRewards: {type: 'waivio_stop_campaign', campaign_id: 'company._id'},
      }),
    },
  ];

  return dispatch({
    type: ANSWER_QUICK_FORECAST,
    payload: {
      promise: new Promise((resolve, reject) =>
        steemConnectAPI
          .broadcast([commentOp])
          .then(() => resolve('SUCCESS'))
          .catch(error => reject(error)))
    }
  })
};
