import React, {Component} from 'react';
import _ from 'lodash';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {AreaChart} from 'react-easy-chart';
import { Popover } from 'antd';
import {currencyFormat} from '../../../platform/numberFormat';
import Favorite from '../../Favorite';
import InstrumentAvatar from '../../InstrumentAvatar/InstrumentAvatar';
import { PlatformHelper } from '../../../platform/platformHelper';
import TradeButtonsAssets from '../../InstrumentsPage/TradeButtonsAssets';
import withTrade from '../../HOC/withTrade';
import '../InstrumentsPage.less';
import {formatSignalsData} from '../../../helpers/signalsHelper';
// import ModalInstrumentsChart from 'components/Modals/ModalInstrumentsChart';
import Signal from '../../InstrumentsPage/Instrument/Signal';

const propTypes = {
  chart: PropTypes.array,
  signals: PropTypes.array,
  deals: PropTypes.object,
  quoteSettings: PropTypes.object.isRequired,
  quote: PropTypes.object.isRequired,
  trendBuy: PropTypes.number.isRequired,
  viewMode: PropTypes.oneOf(['list', 'cards'])
};

class Instrument extends Component {
    constructor (props) {
        super(props);
        this.state = {isModalInstrumentsChart: false};
    }
    getInvestments = () => {
        let sumPnL = 0;
        if (this.props.deals && !_.isEmpty(this.props.deals)) {
            _.map(this.props.deals, (deal) => {
                if (deal.security === this.props.quote.security) sumPnL += PlatformHelper.getPnl(this.props.quote, deal, this.props.quoteSettings);
            });
        }
        return sumPnL !== 0 ? (
            <Link to = '/deals' className="st-assets-to-deals">
                <span title={`${this.props.intl.formatMessage({id: 'deals.cumPnl'})}: ${this.props.quoteSettings.name}`} className={`st-pnl ${sumPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}`}>
                    {currencyFormat(sumPnL.toFixed(2))}
                </span>
            </Link>
        ) : null;
    };
    toggleModalInstrumentsChart = () => {
      this.setState({ isModalInstrumentsChart: !this.state.isModalInstrumentsChart });
    };
    render () {
        const investments = this.getInvestments();
        const instrumentName =
            <Link to={`/quote/${this.props.quote.security}`}>
                <div className="st-instrument-info-wrap">
                    <div className="st-instrument-name" title={this.props.quoteSettings.name}>{this.props.quoteSettings.name} </div>
                </div>
            </Link>;
        const dailyChangeValue =
            <div title={this.props.intl.formatMessage({id: 'tips.dailyChange'})}
                className={`st-daily-change ${this.props.quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down'}`}>
                {`${this.props.quote.dailyChange.toFixed(2)}%`}
            </div>;
        const signal =
            (this.props.signals && this.props.signals.length > 0)
                ? (
                  <Popover
                    placement="bottom"
                    className="st-signal-popover"
                    content={_.map(formatSignalsData(this.props.signals), (signal) =>
                      <Signal key={`signal:${signal.id}`} signal={signal} />)}
                  >
                    <div className="st-signals-button">
                    {this.props.signals.length}
                    </div>
                  </Popover>
              )
                : <div className="st-signals-empty"/>;
        const getChart = (width, height) => this.props.chart && this.props.chart.length !== 0
            ? <AreaChart
                width={width}
                height={height}
                // interpolate={'cardinal'}
                areaColors={['#3a79ee']}
                data={[this.props.chart]}
            /> :
             <div className="st-assets-chart-no-data">{this.props.intl.formatMessage({id: 'charts.noData'})}</div>;
        // const modalChart = this.state.isModalInstrumentsChart &&
            {/*<ModalInstrumentsChart*/}
                {/*quoteName={this.props.quote.security}*/}
                {/*market={this.props.quoteSettings.market}*/}
                {/*isModalInstrumentsChart={this.state.isModalInstrumentsChart}*/}
                {/*toggleModalInstrumentsChart={this.toggleModalInstrumentsChart}*/}
            {/*/>;*/}
        switch (this.props.viewMode) {
        case 'cards':
            return (
                <React.Fragment>
                    <div className="st-card__header">
                        <InstrumentAvatar quoteSecurity={this.props.quote.security} market={this.props.quoteSettings.market}/>
                        {instrumentName}
                        <Favorite quoteSecurity={this.props.quote.security}/>
                    </div>
                    <div className="st-card__content">
                        <div className="st-card__daily-change-signal-info">
                            {dailyChangeValue}
                            {signal}
                        </div>
                        <div className="st-card__chart" onClick={this.toggleModalInstrumentsChart}>
                            {getChart(230, 60)}
                        </div>
                        {/*{modalChart}*/}
                        <TradeButtonsAssets
                            className="st-assets-buttons st-trade-buttons-asset-page-wrap"
                            quoteSecurity={this.props.quote.security}/>
                    </div>
                </React.Fragment>);
        case 'list':
        default:
            return (
                <React.Fragment>
                    <Favorite quoteSecurity={this.props.quote.security}/>
                    <InstrumentAvatar quoteSecurity={this.props.quote.security} market={this.props.quoteSettings.market}/>
                    <div className="d-flex flex-column align-items-center">
                        {instrumentName}
                        {investments}
                    </div>
                    {dailyChangeValue}
                    <div className="st-assets-chart-wrap" onClick={this.toggleModalInstrumentsChart}>
                        {getChart(200, 40)}
                    </div>
                    {/*{modalChart}*/}
                    <TradeButtonsAssets className="st-assets-buttons st-trade-buttons-asset-page-wrap"
                        quoteSecurity={this.props.quote.security}/>
                    {signal}
                </React.Fragment>
            );
        }
    }
}

Instrument.defaultProps = {
    viewMode: 'list'
};

Instrument.propTypes = propTypes;

export default withTrade(injectIntl(Instrument));
