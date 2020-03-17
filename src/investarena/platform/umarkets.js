import _ from 'lodash';
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
} from '../redux/actions/platformActions';
import {
  getOpenDealsSuccess,
  getCloseDealsSuccess,
  changeOpenDealPlatformSuccess,
  closeOpenDealPlatformSuccess,
  updateClosedDealsForStatistics,
} from '../redux/actions/dealsActions';
import { disconnectBroker, reconnectBroker } from '../redux/actions/brokersActions';
import config from '../configApi/config';
import { getChartDataSuccess } from '../redux/actions/chartsActions';
import { updateQuotes } from '../redux/actions/quotesActions';
import { updateQuotesSettings } from '../redux/actions/quotesSettingsActions';
import * as ApiClient from '../../waivioApi/ApiClient';
import { CHART_ID } from '../constants/objectsInvestarena';
import { mutateObject, getOS, exponentialToDecimal } from './platformHelper';
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
    this.websocket = this.createSockJS();
    this.stompClient = Stomp.over(this.websocket);
    this.stompClient.debug = msg => console.log('\tstomp client > ', msg);
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
      this.dispatch(disconnectBroker());
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

  // getOpenDeals() {
  //   this.sendRequestToPlatform(CMD.getOpenDeals, '[]');
  // }

  getClosedDeals(
    period = 'LAST_7_DAYS',
    getClosedDealsForStatistics = false,
    lastClosedDealTime = null,
  ) {
    this.getClosedDealsForStatistics = getClosedDealsForStatistics;
    this.lastClosedDealTime = lastClosedDealTime;
    // this.sendRequestToPlatform(CMD.getClosedDeals, `[${period}, null, null]`);
  }

  getAppIdentity(callerKey) {
    return JSON.stringify({
      OS: getOS(),
      App: config.app,
      Version: config.version,
      Caller: CALLERS[callerKey],
    });
  }

  createOpenDeal(deal, dataDealToApi, callerKey) {
    this.dataDealToApi = dataDealToApi;
    this.sendRequestToPlatform(
      CMD.sendOpenMarketOrder,
      `["${deal.security}","${deal.side}","${deal.amount}","${config.appVersion}"]`,
      this.getAppIdentity(callerKey),
    );
  }

  closeOpenDeal(dealId, callerKey) {
    this.sendRequestToPlatform(
      CMD.sendCloseMarketOrder,
      `["${dealId}","${config.appVersion}"]`,
      this.getAppIdentity(callerKey),
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
    if (active && interval) {
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
    console.log('result', result);
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
        // *** UNSUPPORTED_COMMAND ***
        // case CMD.getOpenDeals:
        //   this.parseOpenDeals(result);
        //   break;
        // case CMD.getClosedDeals:
        //   this.parseClosedDeals(result);
        //   break;
        case CMD.getChartData:
          this.parseChartData(result);
          break;
        case CMD.sendCloseMarketOrder:
          Umarkets.parseCloseMarketOrderResult(result);
          break;
        case CMD.changeOpenDeal:
          Umarkets.parseChangeMarketOrderResult(result);
          break;
        case CMD.sendOpenMarketOrder:
        case CMD.openMarketOrderRejected:
        case CMD.duplicateOpenDeal:
          this.parseOpenMarketOrderResult(result);
          break;
      }
    } else if (result.type === 'event') {
      switch (result.name) {
        case 'deal_opened_by_market_order':
          this.parseOpenByMarketOrder(result);
          break;
        case 'deal_closed_by_market_order':
          this.parseCloseByMarketOrder(result);
          break;
        case 'open_deal_changed':
          this.parseChangeByMarketOrder(result);
          break;
        case 'favorites_security_added':
        case 'favorites_security_removed':
          this.parseUpdateFavorites(result);
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
      // unsupported commands
      // this.getOpenDeals(); // unsupported command
      // this.getClosedDeals();
    }
  }

  parseUserRates(result) {
    const content = result.content;
    const rates = content.rates;
    const data = {};
    rates.forEach(q => {
      if (_.size(this.quotes) !== 0 && q.security in this.quotes) {
        this.fixChange(q.security, q, this.quotes[q.security]);
      }
      this.quotes[q.security] = {
        security: q.security,
        bidPrice: exponentialToDecimal(q.bidPrice),
        askPrice: exponentialToDecimal(q.askPrice),
        dailyChange: q.dailyChange,
        timestamp: q.timestamp,
        state: this.statesQuotes[q.security],
      };
      data[q.security] = {
        security: q.security,
        bidPrice: exponentialToDecimal(q.bidPrice),
        askPrice: exponentialToDecimal(q.askPrice),
        dailyChange: q.dailyChange,
        timestamp: q.timestamp,
        state: this.statesQuotes[q.security],
      };
      if (this.hasOwnProperty('publish')) {
        this.publish(q.security, this.quotes[q.security]);
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
              isSession: _.some(
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
      const currentAccount = _.filter(
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
    // this.quotesSettings = sortedQuotesSettings;
    // this.dispatch(updateQuotesSettings(this.quotesSettings));
  }

  parseChartData(result) {
    const chart = result.content;
    const quoteSecurity = chart.security;
    const timeScale = chart.barType;
    const bars = chart.bars;
    this.dispatch(getChartDataSuccess({ quoteSecurity, timeScale, bars }));
    if (this.hasOwnProperty('publish')) {
      this.publish(`ChartData${quoteSecurity}`, { quoteSecurity, timeScale, bars });
    }
  }

  parseOpenDeals(result) {
    const content = _.sortBy(result.content, 'dealSequenceNumber').reverse();
    const openDeals = {};
    const data = { open_deals: [] };
    content.map(openDeal => {
      openDeal.openPrice /= multiplier;
      openDeal.amount /= multiplier;
      openDeals[openDeal.dealId] = openDeal;
      data.open_deals.push({
        amount: openDeal.amount,
        deal_id: openDeal.dealId,
        deal_sequence_number: openDeal.dealSequenceNumber,
        good_till_date: openDeal.goodTillDate,
        open_price: openDeal.openPrice,
        open_time: openDeal.openTime,
        security: openDeal.security,
        side: openDeal.side,
      });
    });
    this.dispatch(getOpenDealsSuccess(openDeals));
  }

  parseClosedDeals(result) {
    if (!this.getClosedDealsForStatistics) {
      const content = _.sortBy(result.content.closedDeals, 'closeTime').reverse();
      const closedDeals = {};
      content.map(closeDeal => {
        closeDeal.amount /= multiplier;
        closeDeal.pnl /= multiplier;
        closeDeal.openPrice /= multiplier;
        closeDeal.closePrice /= multiplier;
        closedDeals[closeDeal.dealId] = closeDeal;
      });
      this.dispatch(getCloseDealsSuccess(closedDeals));
    } else {
      this.getClosedDealsForStatistics = false;
      const content = _.sortBy(result.content.closedDeals, 'closeTime');
      const contentFilter = content.filter(
        closedDeal => closedDeal.closeTime > this.lastClosedDealTime,
      );
      if (contentFilter.length > 0) {
        const data = { closed_deals: [] };
        content.map(closeDeal => {
          data.closed_deals.push({
            deal_id: closeDeal.dealId,
            deal_sequence_number: closeDeal.dealSequenceNumber,
            security: closeDeal.security,
            side: closeDeal.side,
            amount: closeDeal.amount / multiplier,
            open_price: closeDeal.openPrice / multiplier,
            open_time: closeDeal.openTime,
            close_price: closeDeal.closePrice / multiplier,
            close_time: closeDeal.closeTime,
            rollover_commission: closeDeal.rolloverCommission,
            pnl: closeDeal.pnl / multiplier,
            broker_name: this.platformName,
          });
        });
        this.dispatch(updateClosedDealsForStatistics(data));
      }
    }
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

  parseCloseByMarketOrder(result) {
    message.success('Deal successfully closed');
    this.dispatch(closeOpenDealPlatformSuccess(result.content.dealId));
  }

  parseChangeByMarketOrder(result) {
    const content = result.content;
    if (content.stopLossAmount) {
      content.stopLossPrice = null;
    } else if (content.stopLossPrice) {
      content.stopLossAmount = null;
    } else {
      content.stopLossPrice = null;
      content.stopLossAmount = null;
    }
    if (content.takeProfitAmount) {
      content.takeProfitPrice = null;
    } else if (content.takeProfitPrice) {
      content.takeProfitAmount = null;
    } else {
      content.takeProfitPrice = null;
      content.takeProfitAmount = null;
    }
    message.success('Deal successfully updated');
    this.dispatch(changeOpenDealPlatformSuccess(content));
  }
}
