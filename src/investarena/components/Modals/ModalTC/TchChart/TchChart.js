/* eslint-disable */
import humanize from 'string-humanize';
import React, { Component } from 'react';
import { publishSubscribe, destroyPublishSubscribe } from '../../../../platform/publishSubscribe';
import { singleton } from '../../../../platform/singletonPlatform';

class TchChart extends Component {
    constructor (props) {
        super(props);
    }
  componentDidMount = () => {
    publishSubscribe(singleton.platform);
    let source = 'fes.investarena';
    let name = this.props.quoteSecurity;
    let fullName = singleton.platform.quotesSettings[name] ? singleton.platform.quotesSettings[name].name : name;
    let market = this.props.market;
    let period = humanize(this.props.period);
    let params = {
      pair: {Name: name, FullName: fullName, Category: market},
      period: period,
      timeMode: 'global',
      chartType: 'candle',
      state: 'default',
      indicators: [],
      currentValue: '0.00000',
      connectorOptions: {
        type: source,
        platform: singleton.platform,
        wsUrl: '',
        url: '',
        sid: '',
        authData: {},
        um_session: '',
        sockjspath: ''
      },
      settingsUrl: '//informer.maximarkets.ru/wss/quotation/getsettings?tch=true',
      lang: 'ru',
      isHeaderHidden: false,
      isSidebarHidden: false,
      isFullScreen: false,
      isDataPanel: true,
      isOtherParams: false,
      isAutoRestore: false,
      rowsid: [],
      typeThemes: 'DefaultThema',
      typeData: this.props.typeData === 'Sell' ? 'bid' : 'ask',
      modules: {
        isShowNews: false,
        isHeaderCreate: true,
        isShowEvents: false,
        signals: false,
        chartElements: {}
      }
    };
    configuration.settingsUrl = '//informer.maximarkets.ru/wss/quotation/getsettings?tch=true';
    configuration.lang = 'en';
    configuration.modules.isShowNews = false;
    configuration.modules.isHeaderCreate = true;
    configuration.modules.isSidebarHidden = false;
    configuration.modules.isHeaderHidden = false;
    configuration.modules.isShowEvents = false;
    configuration.modules.signals = false;
    this.createTch(params, 'default');
    document.querySelector('.tch-data-panel').classList.add('invisible');
    document.querySelector('.tch-search-container').classList.add('invisible');
    document.querySelector('.tch-chart-layouts-container').classList.add('invisible');
    setTimeout(() => {
      const sidebarToggle = document.querySelector('.tch-sidebar-close-panel');
      sidebarToggle && sidebarToggle.click();
    },200)

  };
  componentWillUnmount () {
    this.tch.close();
    destroyPublishSubscribe(singleton.platform);
  }
  createTch (params) {
    let tchParent = document.querySelector('.tch-assets-page');
    if (TechnicalChart){
      this.tch = new TechnicalChart(tchParent, params);
      this.tch.init(params);
    }
  }
    render () {
        return (
            <div
                className="tch-wrap"
                style={{width: '100%', height: '100%', position: 'relative'}}
            >
                <div className="tch-technical-chart-container tch-assets-page"
                     style={{width: '100%', height: '100%', backgroundColor: 'yellow'}}
                />
            </div>
        );
    }
}

export default TchChart;
