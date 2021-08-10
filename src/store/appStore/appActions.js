import { message } from 'antd';
import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../../client/helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';
import { setBeneficiaryOwner } from '../searchStore/searchActions';
import { getAuthenticatedUserName } from '../authStore/authSelectors';
import { getCurrentCurrency } from './appSelectors';

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

export const SET_APP_URL = '@app/SET_APP_URL';
export const setAppUrl = createAction(SET_APP_URL);

export const SET_USED_LOCALE = '@app/SET_USED_LOCALE';
export const setUsedLocale = createAction(SET_USED_LOCALE);

export const SET_SCREEN_SIZE = '@app/SET_SCREEN_SIZE';
export const setScreenSize = createAction(SET_SCREEN_SIZE);

export const GET_CRYPTO_PRICE_HISTORY = createAsyncActionType('@app/GET_CRYPTOS_PRICE_HISTORY');
export const REFRESH_CRYPTO_PRICE_HISTORY = '@app/REFRESH_CRYPTO_PRICE_HISTORY';
export const refreshCryptoPriceHistory = createAction(REFRESH_CRYPTO_PRICE_HISTORY);

export const getRate = () => dispatch => {
  dispatch({
    type: RATE_REQUEST.ACTION,
    payload: {
      promise: ApiClient.getCurrentMedianHistory().then(
        resp => parseFloat(resp.base) / parseFloat(resp.quote),
      ),
    },
  });
};

export const getRewardFund = () => dispatch =>
  dispatch({
    type: GET_REWARD_FUND,
    payload: { promise: ApiClient.getRewardFund() },
  });

export const getCryptoPriceHistory = (symbols, refresh = false) => dispatch => {
  if (refresh) symbols.forEach(symbol => dispatch(refreshCryptoPriceHistory(symbol)));

  dispatch({
    type: GET_CRYPTO_PRICE_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getWalletCryptoPriceHistory(symbols).then(response => {
        const storeObject = {};

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
            .map(elem => ({ usd: elem[key].usd, createdAt: elem.createdAt }))
            .reverse();

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
export const HIDE_POST_MODAL = '@app/HIDE_POST_MODAL';

export const showPostModal = createAction(SHOW_POST_MODAL);
export const hidePostModal = createAction(HIDE_POST_MODAL);

export const SET_IS_MOBILE = '@app/SET_IS_MOBILE';
export const setIsMobile = createAction(SET_IS_MOBILE);

export const GET_CURRENT_APP_SETTINGS = createAsyncActionType('@app/GET_CURRENT_APP_SETTINGS');

export const getCurrentAppSettings = () => dispatch => {
  dispatch({ type: GET_CURRENT_APP_SETTINGS.START });

  return ApiClient.getCurrentAppSettings()
    .then(res => {
      if (res.redirect) {
        if (typeof window !== 'undefined') {
          window.location.replace(res.redirect);
        }

        return null;
      }

      dispatch({
        type: GET_CURRENT_APP_SETTINGS.SUCCESS,
        payload: res,
      });
      const { account, percent: weight } = res.beneficiary;

      dispatch(
        setBeneficiaryOwner([
          {
            account,
            weight,
          },
        ]),
      );

      dispatch(getCurrentCurrencyRate(res.currency));

      return res;
    })
    .catch(e => {
      message.error(e.message);

      return dispatch({ type: GET_CURRENT_APP_SETTINGS.ERROR });
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

export const GET_CURRENCY_RATE = createAsyncActionType('@app/GET_CURRENCY_RATE');

export const getCurrentCurrencyRate = currency => (dispatch, getState) => {
  const currentCurrency = getCurrentCurrency(getState());

  if (currentCurrency.type === currency) return null;

  return dispatch({
    type: GET_CURRENCY_RATE.ACTION,
    payload: ApiClient.getCurrentCurrencyRate(currency),
    meta: currency,
  });
};
