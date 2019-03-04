import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import InstrumentAvatar from '../../../InstrumentAvatar/InstrumentAvatar';
import TradeButtonsAssets from '../../TradeButtonsAssets';
import InstrumentsChart from '../InstrumentChart';
import Signals from '../Signals';
import './CardView.less';

@injectIntl
class InstrumentCard extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    toggleModalTC: PropTypes.func.isRequired,
    quoteSettings: PropTypes.shape(),
    quote: PropTypes.shape(),
    chart: PropTypes.arrayOf(PropTypes.shape()),
    signals: PropTypes.arrayOf(PropTypes.shape()),
    showTradeBtn: PropTypes.bool,
    chartHeight: PropTypes.number,
    chartWidth: PropTypes.number,
  };

  static defaultProps = {
    quoteSettings: {},
    quote: {},
    chart: [],
    signals: [],
    showTradeBtn: true,
    chartHeight: 65,
    chartWidth: 221,
  };

  state = {
    isModalChart: false,
  };
  toggleModalInstrumentsChart = () => {
    this.props.toggleModalTC(this.props.quote, this.props.quoteSettings);
  };
  render() {
    const {
      intl,
      quoteSettings,
      quote,
      chart,
      signals,
      showTradeBtn,
      chartHeight,
      chartWidth,
    } = this.props;
    return (
      <div key={quote.security} className="st-card">
        <div className="st-card__header">
          <InstrumentAvatar
            permlink={quoteSettings.wobjData.author_permlink}
            market={quoteSettings.market}
            avatarlink={quoteSettings.wobjData.avatarlink}
          />
          <Link to={`/object/${quoteSettings.wobjData.author_permlink}`}>
            <div className="st-instrument-info-wrap">
              <div className="st-instrument-name" title={quoteSettings.name}>
                {quoteSettings.name}{' '}
              </div>
            </div>
          </Link>
        </div>
        <div className="st-card__content">
          <div className="st-card__daily-change-signal-info">
            <div
              title={intl.formatMessage({ id: 'tips.dailyChange', defaultMessage: 'Daily change' })}
              className={`st-daily-change ${
                quote.dailyChange > 0 ? 'st-quote-text-up' : 'st-quote-text-down'
              }`}
            >
              {quote.dailyChange ? `${quote.dailyChange.toFixed(2)}%` : '—'}
            </div>
            <Signals signals={signals} />
          </div>
          <div role="presentation" onClick={this.toggleModalInstrumentsChart}>
            <InstrumentsChart
              chart={chart}
              height={chartHeight}
              width={chartWidth}
              noDataMsg={intl.formatMessage({ id: 'charts.noData', defaultMessage: 'No data' })}
            />
          </div>
          {showTradeBtn && (
            <TradeButtonsAssets
              className="st-assets-buttons st-trade-buttons-asset-page-wrap"
              quoteSecurity={quote.security}
            />
          )}
        </div>
      </div>
    );
  }
}

export default InstrumentCard;
