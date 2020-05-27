import { get, filter, size, some } from 'lodash';
import { message } from 'antd';
import Cookies from 'js-cookie';
import store from 'store';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { CMD, HOURS } from './platformData';
import {
  connectPlatformSuccess,
  connectPlatformError,
  updateUserAccountCurrency,
  updateUserAccounts,
  updateUserStatistics,
  getUserSettings,
  getAccountStatisticsMap,
  getCurrencySettings,
  updateUserWallet,
} from '../redux/actions/platformActions';

import { disconnectBroker, reconnectBroker } from '../redux/actions/brokersActions';
import config from '../configApi/config';
import { getChartDataSuccess } from '../redux/actions/chartsActions';
import { updateQuotes } from '../redux/actions/quotesActions';
import { updateQuotesSettings } from '../redux/actions/quotesSettingsActions';
import * as ApiClient from '../../waivioApi/ApiClient';
import { CHART_ID } from '../constants/objectsInvestarena';
import { PlatformHelper, mutateObject, getOS } from './platformHelper';
import { CALLERS } from '../constants/platform';

const multiplier = 1000000;

export default class Umarkets {
  constructor() {
    this.accountCurrency = 'USD';
    this.currentAccount = '';
    this.getClosedDealsForStatistics = false;
    this.lastClosedDealTime = null;
    this.quotes = {};
    this.quotesSettings = {};
    this.openDeals = {};
    this.charts = {};
    this.userStatistics = {};
    this.statesQuotes = {};
    this.userSettings = {};
    this.allFavorites = [];
    this.dataDealToApi = null;
    this.websocket = null;
    this.sid = null;
    this.reconnectionCounter = null;
    this.um_session = null;
    this.stompUser = null;
    this.stompPassword = null;
    this.stompClient = null;
    this.platformName = null;
    this.hours = HOURS;
  }

  static parseCloseMarketOrderResult(result) {
    if (result.response === 'NOT_TRADING_TIME') {
      message.error('Not trading time');
    } else if (result.response === 'CLOSE_DEAL_INTERVAL_IS_TOO_SMALL') {
      message.error('Wait 60 seconds after opening deal to close');
    }
  }

  static parseChangeMarketOrderResult(result) {
    if (result.response === 'NOT_TRADING_TIME') {
      message.error('Not trading time');
    } else if (result.response === 'INVALID_ORDER_PRICE') {
      message.error('Invalid order price');
    }
  }

  initialize(reduxStore) {
    this.store = reduxStore;
    this.dispatch = reduxStore.dispatch;
  }

  createWebSocketConnection() {
    this.stompUser = store.get('stompUser');
    this.stompPassword = store.get('stompPassword');
    this.sid = store.get('sid');
    this.um_session = store.get('um_session');
    this.platformName = Cookies.get('platformName');
    if (this.platformName && this.platformName !== 'undefined') {
      this.websocket = this.createSockJS();
      this.stompClient = Stomp.over(this.websocket);
      this.stompClient.debug = () => {};
      this.stompClient.heartbeat.outgoing = 2000;
      this.stompClient.heartbeat.incoming = 0;
      this.stompClient.connect(
        this.stompUser,
        this.stompPassword,
        this.onConnect.bind(this),
        this.onError.bind(this),
        this.onError.bind(this),
        'trading',
      );
    }
  }

  createSockJS() {
    const url = `${config[process.env.NODE_ENV].brokerWSUrl[this.platformName]}`;
    return new SockJS(url);
  }

  closeWebSocketConnection() {
    if (this.websocket && this.stompClient) {
      this.websocket.close();
      this.stompClient.disconnect();
    }
  }

  onConnect() {
    this.dispatch(connectPlatformSuccess(this.platformName));
    if (this.stompClient !== null && this.sid !== null) {
      this.platformSubscribe();
      this.getStartData();
    }
    setInterval(this.getUserStatistics.bind(this), 30000);
  }

  onError(error) {
    this.dispatch(connectPlatformError(error));
    this.reconnect();
  }

  reconnect() {
    if (this.reconnectionCounter !== 1) {
      this.reconnectionCounter = 1;
      if (this.websocket) {
        this.websocket.close();
      }
      const data = {
        platform: this.platformName,
        stomp_user: this.stompUser,
        stomp_password: this.stompPassword,
      };
      this.dispatch(reconnectBroker(data));
    } else {
      this.dispatch(disconnectBroker(true));
    }
  }

  platformSubscribe() {
    this.stompClient.subscribe(
      `/amq/queue/session.${this.sid}`,
      this.onWebSocketMessage.bind(this),
    );
  }

  getStartData() {
    this.getServerTime();
    this.getUserSettings();
    this.getUserStatistics();
    this.getUserRates();
    this.getCrossStatistics();
    // this.getOpenDeals();
    // this.getClosedDeals();
  }

  getServerTime() {
    this.sendRequestToPlatform(CMD.getTime, '[]');
  }

  getUserAccount() {
    this.sendRequestToPlatform(CMD.getUserAccount, '[]');
  }

  getUserSettings() {
    this.sendRequestToPlatform(CMD.getUserSettings, '[]');
  }

  getUserStatistics() {
    this.sendRequestToPlatform(CMD.getUserStatistics, '[]');
  }

  getUserRates() {
    this.sendRequestToPlatform(CMD.getUserRates, '[]');
  }

  getCrossStatistics() {
    this.sendRequestToPlatform(CMD.getCrossStatistics, '[]');
  }

  getAppIdentity(callerKey) {
    return JSON.stringify({
      OS: getOS(),
      App: config.app,
      Version: config.version,
      Caller: CALLERS[callerKey],
    });
  }

  createMarketOrder(deal, dataDealToApi, callerKey) {
    this.sendRequestToPlatform(
      CMD.createMarketOrder,
      `["${deal.security}","${deal.side}","${Number(
        deal.amount,
      )}", ${false}, "IMMEDIATE_OR_CANCEL", "OS: Linux,     App: crypto-investarena,     Caller: chart modal"]`,
    );
  }

  changeAccount(accountName) {
    this.sendRequestToPlatform(CMD.changeAccount, `[${accountName}]`);
  }

  duplicateOpenDeal(dealId, dataDealToApi) {
    this.dataDealToApi = dataDealToApi;
    this.sendRequestToPlatform(CMD.duplicateOpenDeal, `[${dealId},"${config.appVersion}"]`);
  }

  changeOpenDeal(id, slRate = null, slAmount = null, tpRate = null, tpAmount = null) {
    this.sendRequestToPlatform(
      CMD.changeOpenDeal,
      `[${id},${slRate},${slAmount},${tpRate},${tpAmount},"${config.appVersion}"]`,
    );
  }

  getLimitStopOrders() {
    this.sendRequestToPlatform(CMD.getLimitStopOrders, '[]');
  }

  getChartData(active, interval) {
    if (this.websocket.readyState === 1 && active && interval) {
      if (this.stompClient !== null && this.sid !== null && this.um_session !== null) {
        let chartsArr = [[active, interval]];
        chartsArr = JSON.stringify(chartsArr);
        this.stompClient.send(
          '/exchange/CMD/',
          {},
          `{"sid":"${this.sid}", "umid": "${this.um_session}", "cmd" : "${CMD.getChartData}", "array": ${chartsArr}}`,
        );
      }
    }
  }

  sendRequestToPlatform(cmd, params, submissionReason) {
    if (this.stompClient !== null && this.sid !== null && this.um_session !== null) {
      try {
        this.stompClient.send(
          '/exchange/CMD/',
          {},
          `{"sid": "${this.sid}", "umid": "${
            this.um_session
          }", "cmd": "${cmd}", "params": ${params}${
            submissionReason ? `, "submissionReason": ${submissionReason}` : ''
          }}`,
        );
      } catch (e) {
        // console.log('Stomp error ' + e.name + ':' + e.message + '\n' + e.stack);
      }
    }
  }

  onWebSocketMessage(mes) {
    const result = JSON.parse(mes.body);
    if (result.type === 'response' || result.type === 'update') {
      switch (result.cmd) {
        case CMD.getUserRates:
          this.parseUserRates(result);
          break;
        case CMD.getUserStatistics:
          this.parseUserStatistics(result);
          break;
        case CMD.getUserSettings:
          this.parseUserSettings(result);
          break;
        case CMD.getUserAccount:
          this.parseUserAccount(result);
          break;
        case CMD.getCrossStatistics:
          this.parseCrossStatistics(result);
          break;
        case CMD.getChartData:
          this.parseChartData(result);
          break;
        case CMD.createMarketOrder:
          this.parseCreateMarketOrder(result);
          break;
        case CMD.openMarketOrderRejected:
        case CMD.duplicateOpenDeal:
          this.parseOpenMarketOrderResult(result);
          break;
      }
    } else if (result.type === 'event') {
      switch (result.name) {
        case 'order_new':
          this.parseNewOrder(result);
          break;
        case 'order_completely_filled':
          this.parseMarketOrderFilled(result);
          break;
        case 'order_rejected':
          this.parseOrderRejected(result);
          break;
        case 'deal_opened_by_market_order':
          this.parseOpenByMarketOrder(result);
          break;
        case 'deal_closed_by_market_order':
          this.parseCloseByMarketOrder(result);
          break;
        case 'open_deal_changed':
          this.parseChangeByMarketOrder(result);
          break;
      }
    }
  }

  parseUserAccount(result) {
    if (result.content && result.content.currency) {
      this.dispatch(updateUserAccountCurrency(result.content.currency));
      this.accountCurrency = result.content.currency;
      this.getServerTime();
      this.getUserStatistics();
    }
  }

  parseUserRates(result) {
    const content = result.content;
    const rates = content.rates;
    const data = {};
    rates.forEach(q => {
      if (size(this.quotes) !== 0 && q.security in this.quotes) {
        this.fixChange(q.security, q, this.quotes[q.security]);
      }
      this.quotes[q.security] = {
        security: q.security,
        bidPrice: PlatformHelper.exponentialToDecimal(q.bidPrice),
        askPrice: PlatformHelper.exponentialToDecimal(q.askPrice),
        dailyChange: q.dailyChange,
        timestamp: q.timestamp,
        state: this.statesQuotes[q.security],
      };
      data[q.security] = {
        security: q.security,
        bidPrice: PlatformHelper.exponentialToDecimal(q.bidPrice),
        askPrice: PlatformHelper.exponentialToDecimal(q.askPrice),
        dailyChange: q.dailyChange,
        timestamp: q.timestamp,
        state: this.statesQuotes[q.security],
      };
      if (this.hasOwnProperty('publish')) {
        this.publish(q.security, {
          module: 'rates',
          args: [
            {
              Name: q.security,
              Bid: q.bidPrice.toString(),
              Ask: q.askPrice.toString(),
            },
          ],
        });
      }
    });
    this.dispatch(updateQuotes(data));
  }

  fixChange(security, quote, oldQuote) {
    const newPrice = quote.bidPrice;
    const oldPrice = oldQuote.bidPrice * multiplier;
    if (newPrice !== oldPrice) {
      this.statesQuotes[security] = newPrice > oldPrice ? 'up' : 'down';
    }
  }

  parseCrossStatistics(result) {
    const content = result.content.accountsAssetStatisticsMap;
    this.dispatch(getAccountStatisticsMap(content));
  }

  parseUserSettings(result) {
    const content = result.content;
    const quotesSettings = content.securitySettings;
    const tradingSessions = content.tradingSessions;
    this.dispatch(getUserSettings(content.accountsMap));
    this.dispatch(getCurrencySettings(content.currencySettings));
    this.userSettings = content;
    const sortedQuotesSettings = {};
    const currentTime = Date.now();
    ApiClient.getObjects({
      limit: 300,
      invObjects: true,
      requiredFields: [CHART_ID],
    }).then(wobjs => {
      const wobjWithChart = mutateObject(wobjs.wobjects);
      Object.keys(quotesSettings)
        .sort()
        .forEach(key => {
          const wobjData = wobjWithChart.find(o => o.chartId === key);
          if (wobjData) {
            sortedQuotesSettings[key] = {
              ...quotesSettings[key],
              keyName: key,
              isSession: some(
                tradingSessions[quotesSettings[key].calendarCodeId],
                item => currentTime < item.sessionEnd && currentTime > item.sessionStart,
              ),
              market:
                quotesSettings[key].market === 'CryptoCurrency'
                  ? 'Crypto'
                  : quotesSettings[key].market,
              wobjData,
            };
          }
        });
      this.quotesSettings = sortedQuotesSettings;
      this.dispatch(updateQuotesSettings(this.quotesSettings));
    });
    if (content.accounts && content.currentAccountName) {
      this.dispatch(
        updateUserAccounts({
          currentAccountName: content.currentAccountName,
          accounts: content.accounts,
        }),
      );
      const currentAccount = filter(
        content.accounts,
        option => option.name === content.currentAccountName,
      );
      if (
        currentAccount[0] &&
        currentAccount[0].id &&
        this.currentAccount !== currentAccount[0].id
      ) {
        this.getUserAccount(currentAccount[0].id);
        this.currentAccount = currentAccount[0].id;
      }
    }
  }

  parseChartData(result) {
    const chart = result.content;
    const quoteSecurity = chart.security;
    const timeScale = chart.barType;
    const bars =
      chart.bars &&
      chart.bars
        .filter(bar => bar.closeAsk > 0 && bar.closeBid > 0)
        .sort((a, b) => a.time - b.time)
        .slice(-250);
    this.dispatch(getChartDataSuccess({ quoteSecurity, timeScale, bars }));
  }

  parseUserStatistics(result) {
    const content = result.content;
    this.userStatistics = {
      accountId: content.accountId,
      balance: content.balance,
      freeBalance: content.freeBalance,
      marginUsed: content.marginUsed,
      totalEquity: content.totalEquity,
      unrealizedPnl: content.unrealizedPnl,
    };
    this.dispatch(updateUserStatistics(this.userStatistics));
    this.dispatch(updateUserWallet());
  }

  parseOpenMarketOrderResult(result) {
    if (result.response === 'INSUFFICIENT_BALANCE') {
      this.dataDealToApi = null;
      message.error('Insufficient balance');
    } else if (result.response === 'NOT_TRADING_TIME') {
      this.dataDealToApi = null;
      message.error('Not trading time');
    }
  }

  parseOpenByMarketOrder(result) {
    // this.getOpenDeals(); // unsupported command
    message.success('Deal successfully opened');
    if (this.dataDealToApi) {
      this.dataDealToApi.deal_id = result.content.dealId;
      this.dataDealToApi = null;
    }
  }


  // bxy
  parseCreateMarketOrder({ response, content, msg, code }) {
    const { security } = content;
    const baseCurrency = get(this.quotesSettings, [security, 'baseCurrency'], '');
    if (response !== 'SUCCESS') {
      switch (code) {
        case 306:
          message.error(`You don't have a ${baseCurrency} wallet`);
          break;
        case 316: // INVALID_ORDER_QUANTITY - handles in event message
          break;
        case 326:
        default:
          message.error(msg || response);
          break;
      }
    }
  }

  parseNewOrder({ content }) {
    const { amount, security, side } = content.order;
    const baseCurrency = get(this.quotesSettings, [security, 'baseCurrency'], '');
    message.info(
      `Market order created (${side.toLowerCase()} ${amount} ${baseCurrency} at price Market)`,
    );
  }
  parseMarketOrderFilled({ content }) {
    const { amount, averagePrice, security, side } = content.order;
    const baseCurrency = get(this.quotesSettings, [security, 'baseCurrency'], '');
    const termCurrency = get(this.quotesSettings, [security, 'termCurrency'], '');
    const price = PlatformHelper.exponentialToDecimal(averagePrice);
    message.success(
      `Market order filled (${side.toLowerCase()} ${amount} ${baseCurrency} at price ${price} ${termCurrency})`,
      4,
    );
  }
  parseOrderRejected({ content }) {
    message.error(`${content.order.orderStatus} (${content.order.reason})`);
  }
}
