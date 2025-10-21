// import { message } from 'antd';
import { createAction } from 'redux-actions';
import { get } from 'lodash';
import { createAsyncActionType } from '../../common/helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { setBeneficiaryOwner } from '../searchStore/searchActions';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getCurrentCurrency } from './appSelectors';
import { adaptMarketDataToEngine } from '../../common/helpers/cryptosHelper';
import { ADAPT_MARKET_TO_ENGINE } from '../walletStore/walletActions';
import { HBD, HIVE } from '../../common/constants/cryptos';
import { getMainCurrencyRate } from '../ratesStore/ratesAction';
import { getObject, getUserAccount, getParentHost } from '../../waivioApi/ApiClient';
import { getMetadata } from '../../common/helpers/postingMetadata';

export const GET_TRENDING_TOPICS_START = '@app/GET_TRENDING_TOPICS_START';
export const GET_TRENDING_TOPICS_SUCCESS = '@app/GET_TRENDING_TOPICS_SUCCESS';
export const GET_TRENDING_TOPICS_ERROR = '@app/GET_TRENDING_TOPICS_ERROR';

export const GET_REWARD_FUND = '@app/GET_REWARD_FUND';
export const GET_REWARD_FUND_START = '@app/GET_REWARD_FUND_START';
export const GET_REWARD_FUND_SUCCESS = '@app/GET_REWARD_FUND_SUCCESS';
export const GET_REWARD_FUND_ERROR = '@app/GET_REWARD_FUND_ERROR';

export const RATE_REQUEST = createAsyncActionType('@app/RATE_REQUEST');

export const CLOSE_BANNER = '@app/CLOSE_BANNER';
export const closeBanner = createAction(CLOSE_BANNER);

export const SET_APP_HOST = '@app/SET_APP_HOST';
export const setAppHost = payload => ({ type: SET_APP_HOST, payload });

export const SET_APP_AGENT = '@app/SET_APP_AGENT';
export const setAppAgent = payload => ({ type: SET_APP_AGENT, payload });

export const SET_APP_URL = '@app/SET_APP_URL';
export const setAppUrl = createAction(SET_APP_URL);
export const GET_SAFE_LINKS = createAsyncActionType('@app/GET_SAFE_LINKS');
export const getSafeLinksAction = () => dispatch =>
  dispatch({
    type: GET_SAFE_LINKS.ACTION,
    payload: {
      promise: ApiClient.getSafeLinks(),
    },
  });

export const SET_USED_LOCALE = '@app/SET_USED_LOCALE';
export const setUsedLocale = createAction(SET_USED_LOCALE);

export const SET_SCREEN_SIZE = '@app/SET_SCREEN_SIZE';
export const setScreenSize = createAction(SET_SCREEN_SIZE);

export const GET_CRYPTO_PRICE_HISTORY = createAsyncActionType('@app/GET_CRYPTOS_PRICE_HISTORY');
export const REFRESH_CRYPTO_PRICE_HISTORY = '@app/REFRESH_CRYPTO_PRICE_HISTORY';
export const refreshCryptoPriceHistory = createAction(REFRESH_CRYPTO_PRICE_HISTORY);

export const getRate = () => dispatch =>
  dispatch({
    type: RATE_REQUEST.ACTION,
    payload: {
      promise: ApiClient.getCurrentMedianHistory().then(
        resp => parseFloat(resp.base) / parseFloat(resp.quote),
      ),
    },
  });

export const getRewardFund = () => dispatch =>
  dispatch({
    type: GET_REWARD_FUND,
    payload: { promise: ApiClient.getRewardFund() },
  });

export const getCryptoPriceHistory = (refresh = false) => dispatch => {
  const symbols = [HIVE.coinGeckoId, HBD.coinGeckoId];

  if (refresh) symbols.forEach(symbol => dispatch(refreshCryptoPriceHistory(symbol)));

  dispatch({
    type: GET_CRYPTO_PRICE_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getWalletCryptoPriceHistory(symbols).then(response => {
        if (!response?.current) return dispatch({ type: GET_CRYPTO_PRICE_HISTORY.ERROR });
        const storeObject = {};
        const eng = adaptMarketDataToEngine(response, symbols);

        dispatch({
          type: ADAPT_MARKET_TO_ENGINE,
          payload: eng,
        });
        dispatch(getMainCurrencyRate(response));

        Object.keys(response.current).forEach(key => {
          const {
            usd,
            usd_24h_change: usdChange,
            btc,
            btc_24h_change: btcChange,
          } = response.current[key];
          const usdPriceHistory = { usd, usd_24h_change: usdChange };
          const btcPriceHistory = { btc, btc_24h_change: btcChange };
          const priceDetails = response.weekly
            ?.map(elem => ({ usd: elem[key].usd, createdAt: elem.createdAt }))
            ?.reverse();

          storeObject[key] = {
            usdPriceHistory,
            btcPriceHistory,
            priceDetails,
          };
        });

        return storeObject;
      }),
    },
  });
};

export const ADD_NEW_NOTIFICATION = '@user/ADD_NEW_NOTIFICATION';
export const addNewNotification = createAction(ADD_NEW_NOTIFICATION);

export const SHOW_POST_MODAL = '@app/SHOW_POST_MODAL';
export const SET_CURRENT_POST = '@app/SET_CURRENT_POST';
export const HIDE_POST_MODAL = '@app/HIDE_POST_MODAL';

export const showPostModal = createAction(SHOW_POST_MODAL);
export const hidePostModal = createAction(HIDE_POST_MODAL);

export const SET_IS_MOBILE = '@app/SET_IS_MOBILE';
export const setIsMobile = createAction(SET_IS_MOBILE);

export const CHANGE_ADMIN_STATUS = '@app/CHANGE_ADMIN_STATUS';

export const changeAdminStatus = userName => ({
  type: CHANGE_ADMIN_STATUS,
  userName,
});

export const setCurrentShownPost = post => ({
  type: SET_CURRENT_POST,
  payload: post,
});

export const GET_CURRENT_APP_SETTINGS = createAsyncActionType('@app/GET_CURRENT_APP_SETTINGS');

export const getCurrentAppSettings = () => (dispatch, getState) => {
  const isAuth = getAuthenticatedUserName(getState());

  dispatch({ type: GET_CURRENT_APP_SETTINGS.START });

  return ApiClient.getCurrentAppSettings()
    .then(res => {
      if (res.redirect) {
        if (typeof window !== 'undefined') {
          window.location?.replace(res.redirect);
        }

        return null;
      }

      dispatch({
        type: GET_CURRENT_APP_SETTINGS.SUCCESS,
        payload: res,
        userName: isAuth,
      });
      const { account, percent: weight } = res.beneficiary;

      if (!isAuth) dispatch(getCurrentCurrencyRate(res.currency));

      dispatch(setBeneficiaryOwner([{ account, weight }]));

      return res;
    })
    .catch(error => {
      console.error('Error in app action:', error);
      // message.error(e.message);

      dispatch({ type: GET_CURRENT_APP_SETTINGS.ERROR });
    });
};

export const SET_CURRENT_PAGE = '@app/SET_CURRENT_PAGE';

export const setCurrentPage = page => ({
  type: SET_CURRENT_PAGE,
  payload: page,
});

export const GET_RESERVED_COUNTER = createAsyncActionType('@app/GET_RESERVED_COUNTER');

export const getReservedCounter = () => (dispatch, getState) => {
  const authUser = getAuthenticatedUserName(getState());

  if (!authUser) return null;

  return dispatch({
    type: GET_RESERVED_COUNTER.ACTION,
    payload: ApiClient.getReservedCounter(authUser),
  });
};

export const PUT_USER_COORDINATES = createAsyncActionType('@app/PUT_USER_COORDINATES');

export const putUserCoordinates = params => ({
  type: PUT_USER_COORDINATES.ACTION,
  payload: ApiClient.putUserCoordinates(params),
});

export const GET_WEBSITE_CONFIG_FOR_SSR = createAsyncActionType('@app/GET_WEBSITE_CONFIG_FOR_SSR');

export const getWebsiteConfigForSSR = host => ({
  type: GET_WEBSITE_CONFIG_FOR_SSR.ACTION,
  payload: ApiClient.getWebsitesConfiguration(host),
  meta: host,
});

export const SET_SOCIAL_FLAG = '@app/SET_SOCIAL_FLAG';

export const setSocialFlag = () => ({
  type: SET_SOCIAL_FLAG,
});

export const GET_CURRENCY_RATE = createAsyncActionType('@app/GET_CURRENCY_RATE');

export const getCurrentCurrencyRate = (currency = 'USD') => (dispatch, getState) => {
  const currentCurrency = getCurrentCurrency(getState());

  if (currentCurrency.type === currency) return null;

  return dispatch({
    type: GET_CURRENCY_RATE.ACTION,
    payload: ApiClient.getCurrentCurrencyRate(currency),
    meta: currency,
  });
};

export const SET_ITEMS_FOR_NAVIGATION = '@app/SET_ITEMS_FOR_NAVIGATION';

export const setItemsForNavigation = items => ({
  type: SET_ITEMS_FOR_NAVIGATION,
  items,
});

export const SET_MAIN_OBJ = createAsyncActionType('@app/SET_MAIN_OBJ');

export const setMainObj = shopSettings => ({
  type: SET_MAIN_OBJ.ACTION,
  payload: {
    promise:
      shopSettings?.type === 'user'
        ? getUserAccount(shopSettings?.value).then(user => {
            const metadata = getMetadata(user);
            const profile = get(metadata, 'profile', {});
            const description = metadata && get(profile, 'about');

            return {
              description,
            };
          })
        : getObject(shopSettings?.value),
  },
});

export const SET_LOADING_STATUS = '@app/SET_LOADING_STATUS';

export const setLoadingStatus = status => ({
  type: SET_LOADING_STATUS,
  status,
});

export const SET_PARENT_HOST = createAsyncActionType('@app/SET_PARENT_HOST');

export const setParentHost = host => ({
  type: SET_PARENT_HOST.ACTION,
  payload: getParentHost(host),
});

export const SET_IS_DINING = '@app/SET_IS_DINING';

export const setIsDiningGifts = payload => ({
  type: SET_IS_DINING,
  payload,
});

export const SET_IS_SOCIAL_GIFTS = '@app/SET_IS_SOCIAL_GIFTS';

export const setIsSocialGifts = payload => ({
  type: SET_IS_SOCIAL_GIFTS,
  payload,
});
