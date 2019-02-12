import React, { Component } from 'react';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { AreaChart } from 'react-easy-chart';
import { currencyFormat } from '../../../platform/numberFormat';
import InstrumentAvatar from '../../InstrumentAvatar/InstrumentAvatar';
import { PlatformHelper } from '../../../platform/platformHelper';
import TradeButtonsAssets from '../../InstrumentsPage/TradeButtonsAssets';
import withTrade from '../../HOC/withTrade';
import InstrumentCardView from './CardView';
import Signals from './Signals';
import '../InstrumentsPage.less';

const propTypes = {
  chart: PropTypes.arrayOf(PropTypes.shape()),
  intl: PropTypes.shape().isRequired,
  signals: PropTypes.arrayOf(PropTypes.shape()),
  deals: PropTypes.shape(),
  quoteSettings: PropTypes.shape().isRequired,
  quote: PropTypes.shape(),
  viewMode: PropTypes.oneOf(['list', 'cards']),
  toggleModal: PropTypes.func.isRequired,
  platformName: PropTypes.string.isRequired,
};

class Instrument extends Component {
  constructor(props) {
    super(props);
    this.state = { isModalInstrumentsChart: false };
  }
  getInvestments = () => {
    let sumPnL = 0;
    if (this.props.deals && !_.isEmpty(this.props.deals)) {
      _.map(this.props.deals, deal => {
        if (deal.security === this.props.quote.security)
          sumPnL += PlatformHelper.getPnl(this.props.quote, deal, this.props.quoteSettings);
      });
    }
    return sumPnL !== 0 ? (
      <Link to="/deals" className="st-assets-to-deals">
        <span
          title={`${this.props.intl.formatMessage({
            id: 'deals.cumPnl',
            defaultMessage: 'Cumulative P&L',
          })}: ${this.props.quoteSettings.name}`}
          className={`st-pnl ${sumPnL < 0 ? 'st-deal-pl-red' : 'st-deal-pl-green'}`}
        >
          {currencyFormat(sumPnL.toFixed(2))}
        </span>
      </Link>
    ) : null;
  };
  toggleModalInstrumentsChart = () => {
    const { quote, quoteSettings, platformName, toggleModal } = this.props;
    toggleModal('openDeals', { quote, quoteSettings, platformName });
  };
  render() {
    const { intl, quoteSettings, quote, signals, chart } = this.props;
    const investments = this.getInvestments();
    const instrumentName = (
      <Link to={`/object/@${quoteSettings.wobjData.author_permlink}`}>
        <div className="st-instrument-info-wrap">
          <div className="st-instrument-name" title={quoteSettings.name}>
            {quoteSettings.name}{' '}
          </div>
        </div>
      </Link>
    );
    const getChart = (width, height) =>
      chart && chart.length !== 0 ? (
        <AreaChart
          width={width}
          height={height}
          areaColors={['#3a79ee']}
          data={[this.props.chart]}
        />
      ) : (
        <div className="st-assets-chart-no-data">
          {intl.formatMessage({ id: 'charts.noData', defaultMessage: 'No data' })}
        </div>
      );
    if (!(quote && quote.security)) return null;
    switch (this.props.viewMode) {
      case 'cards':
        return (
          <InstrumentCardView
            toggleModalTC={this.toggleModalInstrumentsChart}
            quoteSettings={quoteSettings}
            quote={quote}
            chart={chart}
            signals={signals}
          />
        );
      case 'list':
      default:
        return (
          <div key={quote.security} className="st-list-item">
            <InstrumentAvatar
              permlink={quoteSettings.wobjData.author_permlink}
              market={quoteSettings.market}
              avatarlink={quoteSettings.wobjData.avatarlink}
            />
            <div className="d-flex flex-column align-items-center">
              {instrumentName}
              {investments}
            </div>
            <div
              title={intl.formatMessage({ id: 'tips.dailyChange', defaultMessage: 'Daily change' })}
              className={`st-daily-change ${
                quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down'
              }`}
            >
              {`${quote.dailyChange.toFixed(2)}%`}
            </div>
            <div
              role="presentation"
              className="st-assets-chart-wrap"
              onClick={this.toggleModalInstrumentsChart}
            >
              {getChart(180, 40)}
            </div>
            <TradeButtonsAssets
              className="st-assets-buttons st-trade-buttons-asset-page-wrap"
              quoteSecurity={quote.security}
            />
            <Signals signals={signals} />
          </div>
        );
    }
  }
}

Instrument.defaultProps = {
  quote: {
    security: '',
  },
  viewMode: 'list',
  deals: '',
  chart: [],
  signals: [],
};

Instrument.propTypes = propTypes;

export default withTrade(injectIntl(Instrument));
