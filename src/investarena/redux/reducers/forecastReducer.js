import moment from 'moment';
import * as activeForecastTypes from '../actions/forecastActions';

const initialState = {
  forecastData: [],
  quickForecastData: [],
  userStatistics: [],
  hasMoreStatistic: false,
  winners: [],
  currenUser: {},
  roundInfo: {},
  timer: 0,
  roundTime: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case activeForecastTypes.GET_FORECAST_DATA.SUCCESS:
      return {
        ...state,
        forecastData: action.payload.forecasts
          .filter(f => moment(f.forecast) > moment())
          .sort((a, b) => moment(b.created_at).unix() - moment(a.created_at).unix()), // eslint-disable-line
      };

    case activeForecastTypes.GET_FORECAST_DATA.ERROR:
      return {
        ...state,
        forecastData: [],
      };

    case activeForecastTypes.GET_QUICK_FORECAST_DATA.SUCCESS:
      return {
        ...state,
        quickForecastData: [...action.payload.feed],
        timer: action.payload.timer,
        roundTime: action.payload.round_time
      };

    case activeForecastTypes.GET_QUICK_FORECAST_DATA.ERROR:
      return state;

    case activeForecastTypes.GET_QUICK_FORECAST_STATISTIC.SUCCESS:
      return {
        ...state,
        userStatistics: [...action.payload.top],
        current: {
          ...action.payload.current
        },
      };

    case activeForecastTypes.GET_QUICK_FORECAST_STATISTIC.ERROR:
      return state;

    case activeForecastTypes.GET_QUICK_FORECAST_WINNERS.SUCCESS:
      return {
        ...state,
        winners: [...state.winners, ...action.payload.users.map(user => ({
            name: user.user,
            reward: user.reward,
          })
        )],
        hasMoreStatistic: action.payload.hasMore,
      };

    case activeForecastTypes.GET_QUICK_FORECAST_WINNERS.ERROR:
      return {
        ...state,
        hasMoreStatistic: false,
      };

    case activeForecastTypes.GET_QUICK_FORECAST_REWARDS.SUCCESS:
      return {
        ...state,
        roundInfo: {
          rewards: action.payload.all_time_rewards,
          voitingPowers: action.payload.voting_power,
        },
      };

    case activeForecastTypes.GET_QUICK_FORECAST_REWARDS.ERROR:
      return state;

    case activeForecastTypes.ANSWER_QUICK_FORECAST: {
      const answeredForecast = state.quickForecastData[action.payload.id];

      return {
        ...state,
        quickForecastData: [
          {
            ...answeredForecast,
            active: false,
            side: action.payload.answer,
            postPrice: action.payload.postPrice,
            quickForecastExpiredAt: action.payload.quickForecastExpiredAt,
            status: 'pending',
          },
          ...state.quickForecastData,
        ],
      }
    }

    default:
      return state;
  }
};

export const getForecastData = state => state.forecastData;
