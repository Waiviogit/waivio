import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';
import { LineChart } from 'react-easy-chart';
import { getLocale } from '../../store/reducers';
import { getCryptoDetails, getCurrentDaysOfTheWeek } from '../../helpers/cryptosHelper';
import USDDisplay from '../Utils/USDDisplay';
import Loading from '../Icon/Loading';
import { getCryptosPriceHistory, getIsMobile } from '../../store/appStore/appSelectors';

@connect(state => ({
  cryptosPriceHistory: getCryptosPriceHistory(state),
  locale: getLocale(state),
  isMobile: getIsMobile(state),
}))
class CryptoChart extends React.Component {
  static propTypes = {
    cryptosPriceHistory: PropTypes.shape().isRequired,
    crypto: PropTypes.string,
    locale: PropTypes.string,
    isMobile: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    crypto: '',
    locale: '',
    isMobile: false,
  };

  constructor(props) {
    super(props);
    const currentCrypto = getCryptoDetails(props.crypto);

    this.state = {
      currentCrypto,
      displayChart: false,
      chartConfig: {
        chartWidth: 0,
        showTooltip: false,
        top: '0px',
        left: '0px',
        y: '',
        x: '',
      },
    };
  }

  toggleDisplayChart() {
    const chartWidth = this.chartContainer.clientWidth;

    this.setState(state => ({
      ...state,
      displayChart: !state.displayChart,
      chartConfig: {
        ...state.chartConfig,
        chartWidth,
      },
    }));
  }

  renderUSDPrice() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.coinGeckoId}.usdPriceHistory`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentUSDPrice = _.get(priceDetails, 'usd', 0);
    const priceDifference = _.get(priceDetails, 'usd_24h_change', 0);
    const usdIncrease = priceDifference ? priceDifference >= 0 : false;
    let usdPriceDifferencePercent = priceDifference;

    if (usdPriceDifferencePercent) usdPriceDifferencePercent /= 100;

    return (
      <div className="CryptoTrendingCharts__chart-value">
        <span className="CryptoTrendingCharts__usd-price">
          <USDDisplay value={currentUSDPrice} />
        </span>
        <span
          className={classNames('CryptoTrendingCharts__chart-percent', {
            'CryptoTrendingCharts__chart-price-up': usdIncrease,
            'CryptoTrendingCharts__chart-price-down': !usdIncrease,
          })}
        >
          (
          <FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            value={usdPriceDifferencePercent}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
          )
        </span>
        <i
          className={classNames('iconfont CryptoTrendingCharts__chart-caret', {
            'icon-caret-up': usdIncrease,
            'icon-caretbottom': !usdIncrease,
            'CryptoTrendingCharts__chart-price-up': usdIncrease,
            'CryptoTrendingCharts__chart-price-down': !usdIncrease,
          })}
        />
      </div>
    );
  }

  renderBTCPrice() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
    const cryptoPriceDetailsKey = `${currentCrypto.coinGeckoId}.btcPriceHistory`;
    const priceDetails = _.get(cryptosPriceHistory, cryptoPriceDetailsKey, {});
    const currentBTCPrice = _.get(priceDetails, 'btc', 0);
    const priceDifference = _.get(priceDetails, 'btc_24h_change', 0);
    const btcIncrease = priceDifference >= 0;
    let btcPriceDifferencePercent = priceDifference;

    if (btcPriceDifferencePercent) btcPriceDifferencePercent /= 100;

    return (
      <div className="CryptoTrendingCharts__chart-value">
        <span className="CryptoTrendingCharts__btc-price">
          <FormattedNumber value={currentBTCPrice} minimumFractionDigits={7} />
          {' BTC'}
        </span>
        <span
          className={classNames('CryptoTrendingCharts__chart-percent', {
            'CryptoTrendingCharts__chart-price-up': btcIncrease,
            'CryptoTrendingCharts__chart-price-down': !btcIncrease,
          })}
        >
          (
          <FormattedNumber
            style="percent" // eslint-disable-line react/style-prop-object
            value={btcPriceDifferencePercent}
            minimumFractionDigits={2}
            maximumFractionDigits={2}
          />
          )
        </span>
        <i
          className={classNames('iconfont CryptoTrendingCharts__chart-caret', {
            'icon-caret-up': btcIncrease,
            'icon-caretbottom': !btcIncrease,
            'CryptoTrendingCharts__chart-price-up': btcIncrease,
            'CryptoTrendingCharts__chart-price-down': !btcIncrease,
          })}
        />
      </div>
    );
  }

  chartMouseOverHandler = (data, event) => {
    this.setState(state => ({
      ...state,
      chartConfig: {
        ...state.chartConfig,
        showTooltip: true,
        left: `${event.x - 30}px`,
        top: `${event.y + 10}px`,
        x: data.x,
        y: data.y,
      },
    }));
  };

  chartMouseOutHandler = () => {
    this.setState(state => ({
      ...state,
      chartConfig: {
        ...state.chartConfig,
        showTooltip: false,
      },
    }));
  };

  displayTooltip() {
    const {
      chartConfig: { top, left, x, y },
    } = this.state;

    return <p className="linechart-tooltip" style={{ top, left }}>{`${x}: $${y.toFixed(3)}`}</p>;
  }

  renderChart() {
    const { cryptosPriceHistory, locale, isMobile } = this.props;
    const {
      currentCrypto,
      chartConfig: { chartWidth },
    } = this.state;
    const cryptoPriceHistoryKey = `${currentCrypto.coinGeckoId}.priceDetails`;
    const chartData = _.get(cryptosPriceHistory, cryptoPriceHistoryKey, []);
    const daysOfTheWeek = getCurrentDaysOfTheWeek(locale);

    const graphData = chartData.map((data, idx) => ({ x: daysOfTheWeek[idx], y: data.usd }));

    const config = {
      width: chartWidth,
      height: 100,
      margin: { top: 20, right: 36, bottom: 30, left: 30 },
      axes: true,
      xType: 'text',
      yTicks: 0,
      data: [graphData],
      dataPoints: true,
      mouseOverHandler: !isMobile ? this.chartMouseOverHandler : () => {},
      mouseOutHandler: !isMobile ? this.chartMouseOutHandler : () => {},
    };

    return <LineChart {...config} />;
  }

  render() {
    const { cryptosPriceHistory } = this.props;
    const {
      currentCrypto,
      displayChart,
      chartConfig: { showTooltip },
    } = this.state;
    const cryptoUSDPriceHistoryKey = `${currentCrypto.coinGeckoId}.usdPriceHistory`;
    const usdPriceHistory = _.get(cryptosPriceHistory, cryptoUSDPriceHistoryKey, null);
    const loading = _.isNull(usdPriceHistory);

    if (loading) {
      return (
        <div>
          <div className="SidebarContentBlock__content">
            <Loading />
          </div>
        </div>
      );
    }

    return (
      <div
        ref={chartContainer => {
          this.chartContainer = chartContainer;
        }}
      >
        <div className="SidebarContentBlock__content">
          <div className="CryptoTrendingCharts__chart-header">
            <div className="CryptoTrendingCharts__crypto-name">
              {currentCrypto.name}
              <i
                role="presentation"
                onClick={() => this.toggleDisplayChart()}
                className={classNames('iconfont CryptoTrendingCharts__display-icon', {
                  'icon-unfold': !displayChart,
                  'icon-packup': displayChart,
                })}
              />
            </div>
            {this.renderUSDPrice()}
            {this.renderBTCPrice()}
          </div>
        </div>
        {displayChart && this.renderChart()}
        {showTooltip && this.displayTooltip()}
      </div>
    );
  }
}

export default CryptoChart;
