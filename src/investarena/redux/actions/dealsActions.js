import _ from 'lodash';
import { message } from 'antd';
import api from '../../configApi/apiResources';
import { currentTime } from '../../helpers/currentTime';
import { PlatformHelper } from '../../platform/platformHelper';
import { singleton } from '../../platform/singletonPlatform';

export const GET_OPEN_DEALS_SUCCESS = 'GET_OPEN_DEALS_SUCCESS';
export const GET_CLOSE_DEALS_SUCCESS = 'GET_CLOSE_DEALS_SUCCESS';
export const GET_POST_DEALS_SUCCESS = 'GET_POST_DEALS_SUCCESS';
export const CREATE_POST_OPEN_DEAL_SUCCESS = 'CREATE_POST_OPEN_DEAL_SUCCESS';
export const CHANGE_OPEN_DEAL_SUCCESS = 'CHANGE_OPEN_DEAL_SUCCESS';
export const CLOSE_OPEN_DEAL_SUCCESS = 'CLOSE_OPEN_DEAL_SUCCESS';

export function createMarketOrder(
  quote,
  quoteSettings,
  side,
  amount,
  postId = '',
  platform,
  caller,
) {
  return () => {
    const validAmount = parseFloat(amount.replace(/,/g, ''));
    if (
      validAmount > quoteSettings.maximumQuantity ||
      validAmount < quoteSettings.minimumQuantity
    ) {
      message.error('Invalid amount');
    } else {
      const deal = { security: quote.security, side, amount: validAmount };
      const dataDealToApi = {
        security: quote.security,
        post_id: postId,
        amount: validAmount,
        bid_price: quote.bidPrice,
        ask_price: quote.askPrice,
        leverage: quoteSettings.leverage,
        action: side,
        market: quoteSettings.market,
        platform,
        deal_id: null,
      };
      singleton.platform.createMarketOrder(deal, dataDealToApi, caller);
    }
  };
}

export function createOpenDealApi(dealData) {
  return dispatch => {
    return api.deals.createOpenDeal(dealData).then(({ error }) => {
      if (!error) {
        if (dealData.post_id) {
          dispatch(createPostOpenDealSuccess(dealData));
          message.success('Deal successfully open');
        }
      } else {
        message.error(error.toString());
      }
    });
  };
}

export function getPostOpenDeals(postId) {
  return dispatch => {
    return api.deals.getPostOpenDeals({ post_id: postId }).then(({ data, error }) => {
      if (data && !error) {
        if (data.deals.length > 0) {
          const deals = { [postId]: data.deals };
          dispatch(getPostOpenDealsSuccess(deals));
        }
      }
    });
  };
}

export function closeOpenDealPlatform(dealId, caller) {
  singleton.platform.closeOpenDeal(dealId, caller);
}

export function duplicateOpenDealPlatform(quote, quoteSettings, openDeal, platform) {
  const margin = PlatformHelper.getMargin(quote, quoteSettings, openDeal.amount);
  const dataDealToApi = {
    security: quote.security,
    post_id: '',
    amount: openDeal.amount,
    bid_price: quote.bidPrice,
    ask_price: quote.askPrice,
    leverage: quoteSettings.leverage,
    margin_profit: margin,
    action: openDeal.side === 'SELL' || openDeal.side === 'SHORT' ? 'Sell' : 'Buy',
    platform,
    market: quoteSettings.market,
  };
  singleton.platform.duplicateOpenDeal(openDeal.dealId, dataDealToApi);
}

export function lockOpenDealPlatform(quote, quoteSettings, openDeal, platform, caller) {
  const margin = PlatformHelper.getMargin(quote, quoteSettings, openDeal.amount);
  const dataDealToApi = {
    security: quote.security,
    post_id: '',
    amount: openDeal.amount,
    bid_price: quote.bidPrice,
    ask_price: quote.askPrice,
    leverage: quoteSettings.leverage,
    margin_profit: margin,
    action: openDeal.side === 'SELL' || openDeal.side === 'SHORT' ? 'Buy' : 'Sell',
    platform,
    market: quoteSettings.market,
  };
  const deal = {
    security: openDeal.security,
    side: openDeal.side === 'SELL' || openDeal.side === 'SHORT' ? 'BUY' : 'SELL',
    amount: openDeal.amount * 1000000,
  };
  singleton.platform.createOpenDeal(deal, dataDealToApi, caller);
}

export function changeOpenDealPlatform(id, slRate, slAmount, tpRate, tpAmount) {
  singleton.platform.changeOpenDeal(id, slRate, slAmount, tpRate, tpAmount);
}

export function getLastClosedDealForStatistics(platformName) {
  return () => {
    return api.deals.getLastClosedDeal(platformName).then(({ data, error }) => {
      if (data && !error) {
        if (_.isEmpty(data.last_closed_deal)) {
          singleton.platform.getClosedDeals('LAST_6_MONTHS', true);
        } else {
          const timeNow = currentTime.getTime();
          const diff = Math.ceil((timeNow - data.last_closed_deal.close_time) / (1000 * 3600 * 24));
          if (diff <= 1) {
            singleton.platform.getClosedDeals('TODAY', true, data.last_closed_deal.close_time);
          } else if (diff > 1 && diff <= 2) {
            singleton.platform.getClosedDeals('YESTERDAY', true, data.last_closed_deal.close_time);
          } else if (diff > 2 && diff <= 7) {
            singleton.platform.getClosedDeals(
              'LAST_7_DAYS',
              true,
              data.last_closed_deal.close_time,
            );
          } else if (diff > 7 && diff <= 30) {
            singleton.platform.getClosedDeals(
              'LAST_30_DAYS',
              true,
              data.last_closed_deal.close_time,
            );
          } else if (diff > 30 && diff <= 60) {
            singleton.platform.getClosedDeals(
              'LAST_60_DAYS',
              true,
              data.last_closed_deal.close_time,
            );
          } else if (diff > 60 && diff <= 90) {
            singleton.platform.getClosedDeals(
              'LAST_90_DAYS',
              true,
              data.last_closed_deal.close_time,
            );
          } else if (diff > 90 && diff <= 180) {
            singleton.platform.getClosedDeals(
              'LAST_6_MONTHS',
              true,
              data.last_closed_deal.close_time,
            );
          } else {
            singleton.platform.getClosedDeals(
              'LAST_6_MONTHS',
              true,
              data.last_closed_deal.close_time,
            );
          }
        }
      }
    });
  };
}

export function updateOpenDealsForStatistics(data) {
  return () => {
    return api.deals.updateOpenDealsForStatistics(data);
  };
}

export function updateClosedDealsForStatistics(data) {
  return () => {
    return api.deals.updateClosedDealsForStatistics(data);
  };
}

export function getPostOpenDealsSuccess(data) {
  return { type: GET_POST_DEALS_SUCCESS, payload: data };
}

export function getOpenDealsSuccess(data) {
  return { type: GET_OPEN_DEALS_SUCCESS, payload: data };
}

export function getCloseDealsSuccess(data) {
  return { type: GET_CLOSE_DEALS_SUCCESS, payload: data };
}

export function createPostOpenDealSuccess(data) {
  return { type: CREATE_POST_OPEN_DEAL_SUCCESS, payload: data };
}

export function changeOpenDealPlatformSuccess(data) {
  return { type: CHANGE_OPEN_DEAL_SUCCESS, payload: data };
}

export function closeOpenDealPlatformSuccess(data) {
  return { type: CLOSE_OPEN_DEAL_SUCCESS, payload: data };
}
