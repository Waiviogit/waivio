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
  disabled: false,
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

    case activeForecastTypes.GET_QUICK_FORECAST_DATA.SUCCESS: {
      const mapperList = action.payload.feed.map(forecast => ({
        ...forecast,
        isLoaded: true,
      }));
      return {
        ...state,
        quickForecastData: [...mapperList],
        timer: action.payload.timer,
        roundTime: action.payload.round_time,
      };
    }

    case activeForecastTypes.GET_QUICK_FORECAST_DATA.ERROR:
      return state;

    case activeForecastTypes.GET_QUICK_FORECAST_STATISTIC.SUCCESS:
      return {
        ...state,
        userStatistics: [...action.payload.top],
        current: {
          ...action.payload.current,
        },
      };

    case activeForecastTypes.GET_QUICK_FORECAST_STATISTIC.ERROR:
      return state;

    case activeForecastTypes.GET_QUICK_FORECAST_WINNERS.SUCCESS: {
      return {
        ...state,
        winners: [
          ...action.payload.users.map(user => ({
            name: user.user,
            reward: user.reward,
          })),
        ],
        hasMoreStatistic: action.payload.hasMore,
      };
    }

    case activeForecastTypes.QUICK_FORECAST_WINNERS_SHOW_MORE.SUCCESS: {
      return {
        ...state,
        winners: [
          ...state.winners,
          ...action.payload.users.map(user => ({
            name: user.user,
            reward: user.reward,
          })),
        ],
        hasMoreStatistic: action.payload.hasMore,
      };
    }

    case activeForecastTypes.QUICK_FORECAST_WINNERS_SHOW_MORE.ERROR:
      return state;

    case activeForecastTypes.GET_QUICK_FORECAST_WINNERS.ERROR:
      return state;

    case activeForecastTypes.GET_QUICK_FORECAST_REWARDS.SUCCESS:
      return {
        ...state,
        roundInfo: {
          rewards: action.payload.all_time_rewards,
          votingPowers: action.payload.voting_power,
        },
      };

    case activeForecastTypes.GET_QUICK_FORECAST_REWARDS.ERROR:
      return state;

    case activeForecastTypes.ANSWER_QUICK_FORECAST: {
      const answeredForecast = state.quickForecastData.find(
        forecast => forecast.id === action.payload.id,
      );
      const forecastIndex = state.quickForecastData.indexOf(answeredForecast);
      const answeredArray = state.quickForecastData.filter(forecast => !forecast.active);
      state.quickForecastData.splice(forecastIndex, 1);
      state.quickForecastData.splice(answeredArray.length, 0, {
        ...answeredForecast,
        active: false,
        side: action.payload.answer,
        postPrice: action.payload.postPrice,
        quickForecastExpiredAt: action.payload.quickForecastExpiredAt,
        status: 'pending',
        isLoaded: true,
      });

      return {
        ...state,
        quickForecastData: [...state.quickForecastData],
        disabled: false,
      };
    }

    case activeForecastTypes.ANSWER_QUICK_ERROR: {
      const answeredForecast = state.quickForecastData.find(
        forecast => forecast.id === action.payload.id,
      );
      const forecastIndex = state.quickForecastData.indexOf(answeredForecast);
      state.quickForecastData.splice(forecastIndex, 1, {
        ...answeredForecast,
        isLoaded: true,
      });

      return {
        ...state,
        quickForecastData: [...state.quickForecastData],
        disabled: false,
      };
    }

    case activeForecastTypes.ANSWER_QUICK_LOADING: {
      const answeredForecast = state.quickForecastData.find(
        forecast => forecast.id === action.payload,
      );
      const forecastIndex = state.quickForecastData.indexOf(answeredForecast);
      state.quickForecastData.splice(forecastIndex, 1, {
        ...answeredForecast,
        isLoaded: false,
      });

      return {
        ...state,
        quickForecastData: [...state.quickForecastData],
        disabled: true,
      };
    }

    case activeForecastTypes.GET_QUICK_FORECAST_STATUS.SUCCESS: {
      if (action.payload.status !== 'pending') {
        const answeredForecast = state.quickForecastData.find(
          forecast => forecast.id === action.payload.id,
        );
        const forecastIndex = state.quickForecastData.indexOf(answeredForecast);

        state.quickForecastData.splice(forecastIndex, 1, {
          ...action.payload,
          isLoaded: true,
        });

        return {
          ...state,
          quickForecastData: [...state.quickForecastData],
          disabled: false,
        };
      }

      return state;
    }

    case activeForecastTypes.FINISH_QUICK_FORECAST_TIMER: {
      const activeForecastList = state.quickForecastData.filter(forecast => !forecast.status);

      return {
        ...state,
        winners: [],
        quickForecastData: [...activeForecastList],
      }
    }

    default:
      return state;
  }
};

export const getForecastData = state => state.forecastData;
