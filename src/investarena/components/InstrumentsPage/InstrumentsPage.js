import React, { Component } from 'react';
import _ from 'lodash';
import { Tabs } from 'antd';
// import { browserHistory } from 'react-router';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { getViewMode, setViewMode } from '../../helpers/localStorageHelpers';
import AssetsTab from './AssetsTab/AssetsTab';
import { arrayOfLogos } from '../../constants/arrayOfQuoteLogos';
import { getAllSignals } from '../../redux/actions/signalsActions';
// import QuotesSearch from '../InstrumentsPage/QuotesSearch/QuotesSearch';
// import { searchParams } from '../ItemsSearch/constants';
// import SidebarBack from '../MainPage/Sidebar/SidebarBack';
// import Tabs from '../Tabs';
import './InstrumentsPage.less';
const TabPane = Tabs.TabPane;

const propTypes = {
    charts: PropTypes.object,
    openDeals: PropTypes.object,
    favorites: PropTypes.array.isRequired,
    quotes: PropTypes.object.isRequired,
    quoteSettings: PropTypes.object.isRequired,
    getChartsData: PropTypes.func.isRequired,
    platformConnect: PropTypes.bool.isRequired,
    viewMode: PropTypes.oneOf(['list', 'cards'])
};

class InstrumentsPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            trends: [],
            updatedQuoteSettings: {},
            signals: {},
            viewMode: 'list'
        };
    }
    componentDidMount () {
        this.props.getChartsData();
        // this.props.getInstrumentsTrends().then((data) => {
        //     this.setState({trends: data});
        // });
        getAllSignals().then(({ data, error }) => {
            if (!error && data) {
                this.setState({signals: data});
            }
        });
        const currentViewMode = getViewMode('instruments');
        if (currentViewMode) {
            this.setState({viewMode: currentViewMode});
        }
    }
    componentDidUpdate () {
        if (_.size(this.state.updatedQuoteSettings) === 0 && this.props.quotes && this.props.quoteSettings && _.size(this.props.quotes) > 0 && _.size(this.props.quoteSettings) > 0) {
            this.setState({updatedQuoteSettings: this.getOptions()});
        }
    }
    goToAssets = (quote) => {
        // browserHistory.push(`/quote/${quote.id}`);
    };
    getOptions = () => {
        let resArray = [];
        const self = this;
        _.each(this.props.quotes, (quote) => {
            if (self.props.quoteSettings[quote.security]) {
                resArray.push({id: quote.security,
                    name: self.props.quoteSettings[quote.security].name,
                    image_small: arrayOfLogos.includes(quote.security)
                        ? `/static/images/logoQuotes/${quote.security}.png`
                        : `/static/images/logoQuotes/FX.png`,
                    market: self.props.quoteSettings[quote.security].market}
                );
            }
        });
        return resArray;
    };
    toggleViewMode = () => {
        const viewModeValue = this.state.viewMode === 'list' ? 'cards' : 'list';
        this.setState({viewMode: viewModeValue});
        setViewMode('instruments', viewModeValue);
    };
    render () {
        return (
            <div className="st-instr-page">
                <div className="shifted">
                    <div className="feed-layout container">
                      {/*<div className="st-assets-back"><SidebarBack/></div>*/}
                          <div className="st-instruments-controls">
                          {/*<QuotesSearch*/}
                              {/*placeholderMessage="assets.instrumentsSearch"*/}
                              {/*onChange={this.goToAssets}*/}
                              {/*multi={false}*/}
                              {/*backspaceRemoves={true}*/}
                              {/*searchable={true}*/}
                              {/*labelKey="name"*/}
                              {/*searchParams={searchParams.search}*/}
                              {/*valueKey="id"*/}
                              {/*options={_.sortBy(this.state.updatedQuoteSettings, 'name')}/>*/}
                          {/*<div className="st-instruments-toggle-view" onClick={this.toggleViewMode}>*/}
                              {/*{this.state.viewMode === 'list'*/}
                                  {/*? <img className="st-instruments-toggle-view__icon" src="/static/images/icons/grid-view.svg"/>*/}
                                  {/*: <img className="st-instruments-toggle-view__icon" src="/static/images/icons/list-of-items.svg"/>*/}
                              {/*}*/}
                          {/*</div>*/}
                          </div>
                         <div className="st-assets-wrap">
                            <Tabs defaultActiveKey="1" onChange={this.goToAssets}>
                              <TabPane tab={this.props.intl.formatMessage({ id: 'sidebarWidget.tabTitle.favorites' })} key="1">
                                {this.props.favorites.length !== 0 ? (
                                  <AssetsTab
                                    quotes={this.props.quotes}
                                    charts={this.props.charts}
                                    signals={this.state.signals}
                                    deals={this.props.openDeals}
                                    quoteSettings={this.props.quoteSettings}
                                    title='Favorites'
                                    favorites={this.props.favorites}
                                    trends={this.state.trends}
                                    viewMode={this.state.viewMode}
                                  />
                                ) : (
                                  <div className="st-quotes-no-present">
                                    <div className="st-quotes-no-present-wrap">
                                      <div>
                                        {this.props.intl.formatMessage({ id: 'favorites.quotesNotPresentPart1' })}
                                        <svg height="18" viewBox="0 -3 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                          <path d="M0 0h24v24H0z" fill="none"/>
                                        </svg>
                                        {this.props.intl.formatMessage({ id: 'favorites.quotesNotPresentPart2' })}
                                      </div>
                                    </div>
                                  </div>
                                )
                                }
                              </TabPane>
                                <TabPane tab={this.props.intl.formatMessage({ id: 'modalAssets.cryptocurrencies' })} key="2">
                                  <AssetsTab
                                  quotes={this.props.quotes}
                                  charts={this.props.charts}
                                  signals={this.state.signals}
                                  deals={this.props.openDeals}
                                  quoteSettings={this.props.quoteSettings}
                                  title='CryptoCurrency'
                                  favorites={this.props.favorites}
                                  trends={this.state.trends}
                                  viewMode={this.state.viewMode}/>
                                </TabPane>
                                <TabPane tab={this.props.intl.formatMessage({ id: 'modalAssets.currencies' })} key="3">
                                  <AssetsTab
                                    quotes={this.props.quotes}
                                    charts={this.props.charts}
                                    signals={this.state.signals}
                                    deals={this.props.openDeals}
                                    quoteSettings={this.props.quoteSettings}
                                    title='Currency'
                                    favorites={this.props.favorites}
                                    trends={this.state.trends}
                                    viewMode={this.state.viewMode}/>
                                </TabPane>
                                <TabPane tab={this.props.intl.formatMessage({ id: 'modalAssets.commodities' })} key="4">
                                  <AssetsTab
                                    quotes={this.props.quotes}
                                    charts={this.props.charts}
                                    signals={this.state.signals}
                                    deals={this.props.openDeals}
                                    quoteSettings={this.props.quoteSettings}
                                    title='Commodity'
                                    favorites={this.props.favorites}
                                    trends={this.state.trends}
                                    viewMode={this.state.viewMode}/>
                                </TabPane>
                                <TabPane tab={this.props.intl.formatMessage({ id: 'modalAssets.stocks' })} key="5">
                                  <AssetsTab
                                    quotes={this.props.quotes}
                                    charts={this.props.charts}
                                    signals={this.state.signals}
                                    deals={this.props.openDeals}
                                    quoteSettings={this.props.quoteSettings}
                                    title='Stock'
                                    favorites={this.props.favorites}
                                    trends={this.state.trends}
                                    viewMode={this.state.viewMode}/>
                                </TabPane>
                                <TabPane tab={this.props.intl.formatMessage({ id: 'modalAssets.indices' })} key="6">
                                  <AssetsTab
                                    quotes={this.props.quotes}
                                    charts={this.props.charts}
                                    signals={this.state.signals}
                                    deals={this.props.openDeals}
                                    quoteSettings={this.props.quoteSettings}
                                    title='Index'
                                    favorites={this.props.favorites}
                                    trends={this.state.trends}
                                    viewMode={this.state.viewMode}/>
                                </TabPane>
                            </Tabs>
                        </div>
                      </div>
                  </div>
              </div>
        );
    }
}

InstrumentsPage.propTypes = propTypes;

export default injectIntl(InstrumentsPage);
