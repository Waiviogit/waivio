import { LOCATION_CHANGE } from 'connected-react-router';
import { get } from 'lodash';
import * as appTypes from './appActions';
import * as postActions from '../postsStore/postActions';
import { GET_USER_METADATA } from '../usersStore/usersActions';
import { mobileUserAgents } from '../../helpers/regexHelpers';
import { getObjectAvatar } from '../../helpers/wObjectHelper';
import DEFAULTS from '../../object/const/defaultValues';

const initialState = {
  isFetching: false,
  isLoaded: false,
  rate: 0,
  trendingTopicsLoading: false,
  trendingTopics: [],
  rewardFund: {},
  bannerClosed: false,
  appUrl: 'https://waivio.com',
  usedLocale: null,
  translations: {},
  cryptosPriceHistory: {},
  showPostModal: false,
  currentShownPost: {},
  screenSize: 'large',
  isMobile: false,
  mainPage: 'waivio',
  currPage: '',
  currMap: { center: [], zoom: 6 },
  configuration: {},
  isWaivio: true,
  reservedCounter: 0,
  helmetIcon: DEFAULTS.FAVICON,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_METADATA.SUCCESS:
      if (action.payload && action.payload.settings && action.payload.settings.locale) {
        return { ...state, locale: action.payload.settings.locale };
      }

      return state;
    case appTypes.RATE_REQUEST.SUCCESS:
      return {
        ...state,
        rate: action.payload,
      };
    case postActions.GET_CONTENT.START:
      return {
        ...state,
        isFetching: true,
        isLoaded: false,
      };
    case postActions.GET_CONTENT.SUCCESS:
    case postActions.GET_CONTENT.ERROR:
      return {
        ...state,
        isFetching: false,
        isLoaded: true,
      };
    case appTypes.GET_REWARD_FUND_SUCCESS:
      return {
        ...state,
        rewardFund: {
          ...state.rewardFund,
          ...action.payload,
        },
      };
    case appTypes.GET_TRENDING_TOPICS_START:
      return {
        ...state,
        trendingTopicsLoading: true,
      };
    case appTypes.GET_TRENDING_TOPICS_SUCCESS:
      return {
        ...state,
        trendingTopicsLoading: false,
        trendingTopics: action.payload,
      };
    case appTypes.GET_TRENDING_TOPICS_ERROR:
      return {
        ...state,
        trendingTopicsLoading: false,
        trendingTopics: [],
      };
    case appTypes.CLOSE_BANNER:
      return {
        ...state,
        bannerClosed: true,
      };
    case appTypes.SET_APP_URL:
      return {
        ...state,
        appUrl: action.payload,
      };
    case appTypes.SET_USED_LOCALE:
      return {
        ...state,
        usedLocale: action.payload.id,
        translations: action.payload.translations,
      };
    case appTypes.SET_SCREEN_SIZE:
      return {
        ...state,
        screenSize: action.payload,
      };
    case appTypes.REFRESH_CRYPTO_PRICE_HISTORY:
      return {
        ...state,
        cryptosPriceHistory: {
          ...state.cryptosPriceHistory,
          [action.payload]: null,
        },
      };
    case appTypes.GET_CRYPTO_PRICE_HISTORY.SUCCESS: {
      return {
        ...state,
        cryptosPriceHistory: {
          ...state.cryptosPriceHistory,
          ...action.payload,
        },
      };
    }
    case appTypes.SHOW_POST_MODAL:
      return {
        ...state,
        showPostModal: true,
        currentShownPost: action.payload,
      };
    case LOCATION_CHANGE:
    case appTypes.HIDE_POST_MODAL:
      return {
        ...state,
        showPostModal: false,
      };
    case appTypes.SET_IS_MOBILE:
      return {
        ...state,
        isMobile: mobileUserAgents.test(navigator.userAgent),
      };
    case appTypes.GET_CURRENT_APP_SETTINGS.SUCCESS: {
      const { mainPage, host, configuration, beneficiary, parentHost } = action.payload;

      return {
        ...state,
        mainPage,
        host,
        configuration,
        parentHost,
        websiteBeneficiary: {
          account: beneficiary.account,
          weight: beneficiary.percent,
        },
        helmetIcon: getObjectAvatar(configuration.aboutObject),
        currMap: {
          center: get(configuration, [state.isMobile ? 'mobileMap' : 'desktopMap', 'center'], []),
          zoom: get(configuration, [state.isMobile ? 'mobileMap' : 'desktopMap', 'zoom'], 6),
        },
        isWaivio: mainPage === 'waivio',
      };
    }

    case appTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currPage: action.payload,
      };

    case appTypes.GET_RESERVED_COUNTER.SUCCESS:
      return {
        ...state,
        reservedCounter: action.payload.count,
      };

    default:
      return state;
  }
};
