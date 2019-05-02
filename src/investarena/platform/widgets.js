import _ from 'lodash';
import config from '../configApi/config';
import {
  connectPlatformSuccess,
  connectPlatformError,
  updateUserAccountCurrency,
  updateUserStatistics,
} from '../redux/actions/platformActions';
import { getChartDataSuccess } from '../redux/actions/chartsActions';
import { updateQuotes } from '../redux/actions/quotesActions';
import { updateQuotesSettings } from '../redux/actions/quotesSettingsActions';
import * as ApiClient from '../../waivioApi/ApiClient';
import { objectFields } from '../../common/constants/listOfFields';
import { getFieldWithMaxWeight } from '../../client/object/wObjectHelper';

export class Widgets {
  constructor() {
    this.accountCurrency = 'USD';
    this.quotes = {};
    this.websocket = null;
    this.signals = [];
    this.quotesSettings = {};
    this.statesQuotes = {};
    this.userStatistics = {
      balance: '0',
      freeBalance: '0',
      marginUser: '0',
      totalEquity: '0',
      unrealizedPnl: '0',
    };
  }
  initialize({ dispatch }) {
    this.dispatch = dispatch;
  }
  createWebSocketConnection() {
    this.websocket = new WebSocket(config[process.env.NODE_ENV].brokerWSUrl.widgets);
    this.websocket.onopen = () => {
      this.dispatch(connectPlatformSuccess('widgets'));
      this.onConnect();
    };
    this.websocket.onerror = evt => {
      this.dispatch(connectPlatformError());
      this.onError(evt);
    };
    this.websocket.onmessage = evt => {
      this.onWebSocketMessage(evt.data);
    };
  }
  closeWebSocketConnection() {
    if (this.websocket) {
      this.websocket.close();
    }
  }
  onConnect() {
    this.subscribeRates();
    this.subscribeSettings();
    this.dispatch(updateUserStatistics({}));
    this.dispatch(updateUserAccountCurrency('USD'));
  }
  onError() {
    // console.log(error);
  }
  onWebSocketMessage(data) {
    const msg = JSON.parse(data.trim());
    if (msg.module) {
      switch (msg.module) {
        case 'rates':
          this.parseRates(msg);
          break;
        case 'settings':
          this.parseSettings(msg);
          break;
        case 'history':
          this.parseChartData(msg);
          break;
        case 'error':
          break;
        default:
          break;
      }
    }
  }
  subscribeRates() {
    this.websocket.send(
      JSON.stringify({
        module: 'rates',
        cmd: 'subscribe',
      }),
    );
  }
  subscribeSettings() {
    this.websocket.send(
      JSON.stringify({
        module: 'settings',
        cmd: 'trading',
        args: '',
      }),
    );
  }
  getChartData(security, interval) {
    if (security && interval) {
      interval = interval.charAt(0) + interval.slice(1).toLowerCase();
      this.websocket.send(
        JSON.stringify({
          module: 'history',
          cmd: 'bars',
          args: {
            period: interval,
            quote: security,
            count: 250,
            name: 'name',
          },
        }),
      );
    }
  }
  // getFavorites () {
  //     this.dispatch(getFavorites());
  // }
  // updateFavorite (quoteSecurity) {
  //     this.dispatch(updateFavorite(quoteSecurity));
  // }
  parseRates(msg) {
    const data = {};
    if (msg.args) {
      msg.args.forEach(q => {
        if (_.size(this.quotes) !== 0 && this.quotes[q.Name]) {
          this.fixChange(q.Name, q, this.quotes[q.Name]);
        }
        this.quotes[q.Name] = {
          security: q.Name,
          bidPrice: q.Sess === 'Close' ? q.ESV : q.Bid,
          askPrice: q.Sess === 'Close' ? q.ESV : q.Ask,
          dailyChange: +q.Rate,
          timestamp: q.Timestamp,
          isSession: q.Sess === 'Open',
          state: this.statesQuotes[q.Name],
        };
        data[q.Name] = {
          security: q.Name,
          bidPrice: q.Sess === 'Close' ? q.ESV : q.Bid,
          askPrice: q.Sess === 'Close' ? q.ESV : q.Ask,
          dailyChange: +q.Rate,
          timestamp: q.Timestamp,
          isSession: q.Sess === 'Open',
          state: this.statesQuotes[q.Name],
        };
        if (this.hasOwnProperty('publish')) {
          this.publish(q.Name, this.quotes[q.Name]);
        }
      });
      this.dispatch(updateQuotes(data));
    }
  }
  parseSettings(msg) {
    const quotesSettings = JSON.parse(msg.args);
    const keys = Object.keys(quotesSettings);
    const sortedQuotesSettings = {};
    keys.sort();
    ApiClient.getObjects({ limit: 500, invObjects: true, requiredFields: ['chartid'] }).then(
      wobjs => {
        for (const i in keys) {
          const key = keys[i];
          const wobjData = _.find(wobjs.wobjects, o =>
            _.find(o.fields, field => field.name === 'chartid' && field.body === key),
          );
          sortedQuotesSettings[key] = quotesSettings[key];

          if (wobjData) {
            sortedQuotesSettings[key].wobjData = {
              avatarlink: getFieldWithMaxWeight(wobjData, objectFields.avatar),
              author_permlink: wobjData.author_permlink,
            };
          }
        }
        this.quotesSettings = sortedQuotesSettings;
        this.dispatch(updateQuotesSettings(this.quotesSettings));
      },
    );
  }
  parseChartData(msg) {
    if (msg.args) {
      const timeScale = msg.args.barType.toUpperCase();
      const quoteSecurity = msg.args.security.replace('/', '');
      let bars = [];
      msg.args.bars.forEach(e => {
        bars.push({
          closeAsk: e.closeAsk * 1000000,
          closeBid: e.closeBid * 1000000,
          highAsk: e.highAsk * 1000000,
          highBid: e.highBid * 1000000,
          lowAsk: e.lowAsk * 1000000,
          lowBid: e.lowBid * 1000000,
          openAsk: e.openAsk * 1000000,
          openBid: e.openBid * 1000000,
          time: e.time * 1000,
        });
      });
      bars = _.sortBy(bars, 'time');
      this.dispatch(getChartDataSuccess({ quoteSecurity, timeScale, bars }));
      if (this.hasOwnProperty('publish')) {
        this.publish(`ChartData${quoteSecurity}`, { quoteSecurity, timeScale, bars });
      }
    }
  }
  fixChange(security, quote, oldQuote) {
    const newPrice = quote.Bid;
    const oldPrice = oldQuote.bidPrice;
    if (newPrice !== oldPrice) {
      this.statesQuotes[security] = newPrice > oldPrice ? 'up' : 'down';
    }
  }
}
