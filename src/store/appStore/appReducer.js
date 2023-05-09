import { LOCATION_CHANGE } from 'connected-react-router';
import { get } from 'lodash';
import * as appTypes from './appActions';
import * as postActions from '../postsStore/postActions';
import { GET_USER_METADATA } from '../usersStore/usersActions';
import { mobileUserAgents } from '../../common/helpers/regexHelpers';
import { getObjectAvatar, getObjectName } from '../../common/helpers/wObjectHelper';
import DEFAULTS from '../../client/object/const/defaultValues';
import { listOfWebsiteWithMainPage } from '../../common/constants/listOfWebsite';

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
  websiteName: 'Waivio',
  currPage: '',
  currMap: { center: [], zoom: 6 },
  configuration: {},
  currencyInfo: {
    type: 'USD',
    rate: 1,
  },
  isWaivio: true,
  reservedCounter: 0,
  helmetIcon: DEFAULTS.FAVICON,
  isSocial: false,
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
      const deviceType = mobileUserAgents.test(navigator.userAgent) ? 'mobile' : 'desktop';
      const currMap = configuration?.[`${deviceType}Map`];
      const logo = configuration?.[`${deviceType}Logo`];

      return {
        ...state,
        websiteName: getObjectName(configuration.aboutObject),
        mainPage,
        host,
        configuration,
        parentHost,
        websiteBeneficiary: {
          account: beneficiary.account,
          weight: beneficiary.percent,
        },
        helmetIcon: getObjectAvatar(configuration.aboutObject),
        logo,
        currMap,
        isWaivio: mainPage === 'waivio',
      };
    }
    case appTypes.GET_WEBSITE_CONFIG_FOR_SSR.SUCCESS: {
      const deviceType = state.isMobile ? 'mobile' : 'desktop';
      const currMap = action.payload[`${deviceType}Map`];
      const logo = action.payload[`${deviceType}Logo`];
      const startup = get(action.payload, 'configuration.header.startup', 'map');

      return {
        ...state,
        configuration: action.payload,
        currency: action.payload.currency,
        helmetIcon: getObjectAvatar(action.payload.aboutObject),
        websiteName: getObjectName(action.payload.aboutObject),
        hostAddress: action.meta,
        isDiningGifts:
          listOfWebsiteWithMainPage.some(site => site === action.meta) || startup === 'about',
        logo,
        currMap,
      };
    }

    case appTypes.SET_CURRENT_PAGE:
      return {
        ...state,
        currPage: action.payload,
      };

    case appTypes.SET_SOCIAL_FLAG:
      return {
        ...state,
        isSocial: true,
      };

    case appTypes.GET_RESERVED_COUNTER.SUCCESS:
      return {
        ...state,
        reservedCounter: action.payload.count,
      };

    case appTypes.GET_CURRENCY_RATE.SUCCESS:
      return {
        ...state,
        currencyInfo: {
          type: action.meta,
          rate: action.payload[action.meta],
        },
      };

    default:
      return state;
  }
};
