import { createAction } from 'redux-actions';
import { createAsyncActionType } from '../helpers/stateHelpers';
import * as ApiClient from '../../waivioApi/ApiClient';

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

export const getRate = () => (dispatch, getState, { steemAPI }) => {
  dispatch({
    type: RATE_REQUEST.ACTION,
    payload: {
      promise: steemAPI
        .sendAsync('get_current_median_history_price', [])
        .then(resp => parseFloat(resp.base) / parseFloat(resp.quote)),
    },
  });
};

export const getRewardFund = () => (dispatch, getSelection, { steemAPI }) =>
  dispatch({
    type: GET_REWARD_FUND,
    payload: { promise: steemAPI.sendAsync('get_reward_fund', ['post']) },
  });

// export const getTrendingTopics = () => (dispatch, getState, { steemAPI }) => {
//   dispatch({
//     type: GET_TRENDING_TOPICS,
//     payload: {
//       promise: steemAPI.sendAsync('get_trending_tags', [undefined, 50]).then(result =>
//         Object.values(result)
//           .map(tag => tag.name)
//           .filter(tag => tag !== ''),
//       ),
//     },
//   });
// };

export const getCryptoPriceHistory = (symbol, refresh = false) => dispatch => {
  if (refresh) dispatch(refreshCryptoPriceHistory(symbol));

  dispatch({
    type: GET_CRYPTO_PRICE_HISTORY.ACTION,
    payload: {
      promise: ApiClient.getWalletCryptoPriceHistory(symbol).then(response => {
        const { usd, usd_24h_change: usdChange, btc, btc_24h_change: btcChange } = response.current[
          symbol
        ];
        const usdPriceHistory = { usd, usd_24h_change: usdChange };
        const btcPriceHistory = { btc, btc_24h_change: btcChange };
        const priceDetails = response.weekly
          .map(elem => ({ usd: elem[symbol].usd, createdAt: elem.createdAt }))
          .reverse();

        return {
          usdPriceHistory,
          btcPriceHistory,
          priceDetails,
          symbol,
        };
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
