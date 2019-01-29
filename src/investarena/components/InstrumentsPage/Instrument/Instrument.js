import React, {Component} from 'react';
import _ from 'lodash';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AreaChart } from 'react-easy-chart';
import {currencyFormat} from '../../../platform/numberFormat';
import Favorite from '../../Favorite';
import InstrumentAvatar from '../../InstrumentAvatar/InstrumentAvatar';
import { PlatformHelper } from '../../../platform/platformHelper';
import TradeButtonsAssets from '../../InstrumentsPage/TradeButtonsAssets';
import withTrade from '../../HOC/withTrade';
import '../InstrumentsPage.less';
import Signals from '../../InstrumentsPage/Instrument/Signals';
import ModalTC from "../../Modals/ModalTC/ModalTC";

const propTypes = {
  chart: PropTypes.array,
  intl: PropTypes.shape().isRequired,
  signals: PropTypes.array,
  deals: PropTypes.shape(),
  quoteSettings: PropTypes.shape().isRequired,
  quote: PropTypes.shape().isRequired,
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
                <span title={`${this.props.intl.formatMessage({id: 'deals.cumPnl', defaultMessage: 'Cumulative P&L'})}: ${this.props.quoteSettings.name}`} className={`st-pnl ${sumPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}`}>
                    {currencyFormat(sumPnL.toFixed(2))}
                </span>
            </Link>
        ) : null;
    };
    toggleModalInstrumentsChart = () => {
      this.setState({ isModalInstrumentsChart: !this.state.isModalInstrumentsChart });
    };
    render () {
        const {quoteSettings, quote, signals, chart} = this.props;
        const investments = this.getInvestments();
        const instrumentName =
            <Link to={`/object/@${quoteSettings.wobjData.author_permlink}`}>
                <div className="st-instrument-info-wrap">
                    <div className="st-instrument-name" title={quoteSettings.name}>{quoteSettings.name} </div>
                </div>
            </Link>;
        const dailyChangeValue =
            <div title={this.props.intl.formatMessage({id: 'tips.dailyChange', defaultMessage: 'Daily change'})}
                className={`st-daily-change ${quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down'}`}>
                {`${quote.dailyChange.toFixed(2)}%`}
            </div>;
        const getChart = (width, height) => chart && chart.length !== 0
            ? <AreaChart
                width={width}
                height={height}
                areaColors={['#3a79ee']}
                data={[this.props.chart]}
            /> :
             <div className="st-assets-chart-no-data">{this.props.intl.formatMessage({id: 'charts.noData', defaultMessage: 'No data'})}</div>;
        const modalChart = this.state.isModalInstrumentsChart &&
            <ModalTC
                quoteName={quote.security}
                market={quoteSettings.market}
                isOpen={this.state.isModalInstrumentsChart}
                toggle={this.toggleModalInstrumentsChart}
            />;
        switch (this.props.viewMode) {
        case 'cards':
            return (
                <React.Fragment>
                    <div className="st-card__header">
                        <InstrumentAvatar
                          permlink={quoteSettings.wobjData.author_permlink}
                          market={quoteSettings.market}
                          avatarlink={quoteSettings.wobjData.avatarlink}
                        />
                        {instrumentName}
                        <Favorite quoteSecurity={quote.security}/>
                    </div>
                    <div className="st-card__content">
                        <div className="st-card__daily-change-signal-info">
                            {dailyChangeValue}
                            <Signals signals={signals} />
                        </div>
                        <div role='presentation' className="st-card__chart" onClick={this.toggleModalInstrumentsChart}>
                            {getChart(276, 60)}
                        </div>
                        {modalChart}
                        <TradeButtonsAssets
                            className="st-assets-buttons st-trade-buttons-asset-page-wrap"
                            quoteSecurity={quote.security}/>
                    </div>
                </React.Fragment>);
        case 'list':
        default:
            return (
                <React.Fragment>
                    <Favorite quoteSecurity={quote.security}/>
                    <InstrumentAvatar
                      permlink={quoteSettings.wobjData.author_permlink}
                      market={quoteSettings.market}
                      avatarlink={quoteSettings.wobjData.avatarlink}
                    />
                    <div className="d-flex flex-column align-items-center">
                        {instrumentName}
                        {investments}
                    </div>
                    {dailyChangeValue}
                    <div role="presentation" className="st-assets-chart-wrap" onClick={this.toggleModalInstrumentsChart}>
                        {getChart(180, 40)}
                    </div>
                    {modalChart}
                    <TradeButtonsAssets className="st-assets-buttons st-trade-buttons-asset-page-wrap"
                        quoteSecurity={quote.security}/>
                    <Signals signals={signals} />
                </React.Fragment>
            );
        }
    }
}

Instrument.defaultProps = {
    viewMode: 'list',
    deals: ''
};

Instrument.propTypes = propTypes;

export default withTrade(injectIntl(Instrument));
