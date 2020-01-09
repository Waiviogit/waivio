import moment from 'moment';
import * as activeForecastTypes from '../actions/forecastActions';

const initialState = {
  forecastData: [],
  quickForecastData: [{
    name: 'Bitcoin',
    title: 'Sed ut perectetur, adipoluptatemi in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"',
    avatar: 'https://waivio.nyc3.digitaloceanspaces.com/1562259438_7fd702aa-2940-4a6e-aad4-18a71db2d193_medium',
    author_permlink: "ukd-bitcoin",
    parent: {
      author_permlink: 'ukd-bitcoin'
    },
    chartid: 'BTCUSD',
    parentName: 'author',
    fields: [],
    permlink: 'fdgdg',
    wasClicked: true
  },{
    name: 'Bitcoin',
    title: 'Sed ut perectetur, adipoluptatemi in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"',
    avatar: 'https://waivio.nyc3.digitaloceanspaces.com/1562259438_7fd702aa-2940-4a6e-aad4-18a71db2d193_medium',
    author_permlink: "ukd-bitcoin",
    parent: {
      author_permlink: 'ukd-bitcoin'
    },
    chartid: 'BTCUSD',
    parentName: 'author',
    fields: [],
    permlink: 'fdgdg',
    wasClicked: false
  }, {
    name: 'Bitcoin',
    title: 'Sed ut perectetur, adipoluptatemi in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"',
    avatar: 'https://waivio.nyc3.digitaloceanspaces.com/1562259438_7fd702aa-2940-4a6e-aad4-18a71db2d193_medium',
    author_permlink: "ukd-bitcoin",
    parent: {
      author_permlink: 'ukd-bitcoin'
    },
    chartid: 'BTCUSD',
    parentName: 'author',
    fields: [],
    permlink: 'fdgdg',
    wasClicked: false
  }, {
    name: 'Bitcoin',
    title: 'Sed ut perectetur, adipoluptatemi in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"',
    avatar: 'https://waivio.nyc3.digitaloceanspaces.com/1562259438_7fd702aa-2940-4a6e-aad4-18a71db2d193_medium',
    author_permlink: "ukd-bitcoin",
    parent: {
      author_permlink: 'ukd-bitcoin'
    },
    chartid: 'BTCUSD',
    parentName: 'author',
    fields: [],
    permlink: 'fdgdg',
    wasClicked: false
  }, {
    name: 'Bitcoin',
    title: 'Sed ut perectetur, adipoluptatemi in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"',
    avatar: 'https://waivio.nyc3.digitaloceanspaces.com/1562259438_7fd702aa-2940-4a6e-aad4-18a71db2d193_medium',
    author_permlink: "ukd-bitcoin",
    parent: {
      author_permlink: 'ukd-bitcoin'
    },
    chartid: 'BTCUSD',
    parentName: 'author',
    fields: [],
    permlink: 'fdgdg',
    wasClicked: false
  }],
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

    case activeForecastTypes.GET_QUICK_FORECAST_DATA:
      return {
        ...state,
        quickForecastData: [...action.payload],
      };

    case activeForecastTypes.ANSWER_QUICK_FORECAST:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export const getForecastData = state => state.forecastData;
