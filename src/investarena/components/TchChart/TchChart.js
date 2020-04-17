/* eslint-disable */
import humanize from 'string-humanize';
import React, { Component } from 'react';
import { publishSubscribe, destroyPublishSubscribe } from '../../platform/publishSubscribe';
import { singleton } from '../../platform/singletonPlatform';
import { quoteIdForWidget } from '../../constants/constantsWidgets';
import { invArena } from '../../configApi/apiResources';
import './TchChart.less';

class TchChart extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = () => {
    publishSubscribe(singleton.platform);
    let source = 'crypto-investarena';
    const quoteId = quoteIdForWidget[this.props.quoteSecurity];
    const name = this.props.quoteSecurity;
    const fullName = singleton.platform.quotesSettings[name]
      ? singleton.platform.quotesSettings[name].name
      : name;
    const market = 'crypto';
    const period = humanize(this.props.period);
    let params = {
      pair: { ID: quoteId, Name: name, FullName: fullName, Category: market },
      period: period,
      timeMode: 'global',
      chartType: 'candle',
      state: false,
      indicators: [],
      currentValue: '0.00000',
      connectorOptions: {
        // url: '//44.233.188.11/wss/api/quotation/', // url for development
        url: '//informer.beaxy.com/wss/api/quotation/',
        wsUrl: invArena.wsChartUrl,
        settingsUrl: 'https://wgt-srv0.beaxy.com/wss/quotation/getsettings?tch=true',
        type: source,
      },
      lang: 'en',
      isHeaderHidden: false,
      isSidebarHidden: false,
      isFullScreen: false,
      isDataPanel: true,
      isOtherParams: false,
      isAutoRestore: false,
      rowsid: [],
      typeThemes: 'default',
      typeData: this.props.typeData === 'Sell' ? 'bid' : 'ask',
      modules: {
        isShowNews: false,
        isHeaderCreate: true,
        isShowEvents: false,
        signals: false,
      },
    };
    this.createTch(params);
    this.tch.initialization();
    document.querySelector('.tch-data-panel').classList.add('invisible');
    document.querySelector('.tch-search-container').classList.add('invisible');
    document.querySelector('.tch-chart-layouts-container').classList.add('invisible');
    document.querySelector('.tch-tab-btn').classList.add('tch-hidden');
    document.querySelector('.tch-fullscreen-btn').classList.add('tch-hidden');
    setTimeout(() => {
      const sidebarToggle = document.querySelector('.tch-sidebar-close-panel');
      sidebarToggle && sidebarToggle.click();
    }, 300);
  };
  componentWillUnmount() {
    this.tch.close();
    destroyPublishSubscribe(singleton.platform);
  }
  createTch(params) {
    let tchParent = document.querySelector('.tch-assets-page');
    const { connectorOptions, ...config } = params;
    if (TechnicalChart) {
      this.tch = new TechnicalChart(
        {
          container: tchParent,
          connectorOptions,
          config,
          id: 'TCHART',
        },
        null,
      );

      this.tch.connector.getConnectionSettings = () => {};

      this.tch.connector.createWebSocketConn = () => {
        const _this = this.tch.connector;
        _this.client = singleton.platform;
        _this.client.connected = true;
        _this.client.onWebsocketMessage = msg => {
          const data = _this.processRatesData(msg);
          _this.listeners[0].onConnectorMessage(data, _this.listeners[0]);
        };

        if (_this.listeners && _this.listeners.length) {
          _this.listeners[0].onConnect();
          _this.client.subscribe(this.props.quoteSecurity, _this.client.onWebsocketMessage);
        }
      };

      this.tch.connector.onReconnect = () => {};
      this.tch.connector.subscribe = () => {};

      this.tch.connector.close = () => {
        const _this = this.tch.connector;
        if (_this && _this.client) {
          _this.client.unsubscribe(this.props.quoteSecurity, _this.client.onWebsocketMessage);
          _this.client = null;
        }
      };
    }
  }
  render() {
    return (
      <div className="tch-wrap" style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div
          className="tch-technical-chart-container tch-assets-page"
          style={{ width: '100%', height: '100%', backgroundColor: 'yellow' }}
        />
      </div>
    );
  }
}

export default TchChart;
