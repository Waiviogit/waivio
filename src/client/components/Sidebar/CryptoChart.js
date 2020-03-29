import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';
import { getCryptosPriceHistory, getLocale } from '../../reducers';
import { getCryptoPriceHistory } from '../../app/appActions';
import { getCryptoDetails } from '../../helpers/cryptosHelper';
import USDDisplay from '../Utils/USDDisplay';
import Loading from '../Icon/Loading';

@connect(
  state => ({
    cryptosPriceHistory: getCryptosPriceHistory(state),
    locale: getLocale(state),
  }),
  {
    getCryptoPriceHistory,
  },
)
class CryptoChart extends React.Component {
  static propTypes = {
    cryptosPriceHistory: PropTypes.shape().isRequired,
    getCryptoPriceHistory: PropTypes.func.isRequired,
    refreshCharts: PropTypes.bool,
    crypto: PropTypes.string,
  };

  static defaultProps = {
    refreshCharts: false,
    crypto: '',
    locale: '',
  };

  constructor(props) {
    super(props);
    const currentCrypto = getCryptoDetails(props.crypto);

    this.state = {
      currentCrypto,
      displayChart: false,
    };
  }

  componentDidMount() {
    const { currentCrypto } = this.state;
    if (!_.isEmpty(currentCrypto)) {
      this.props.getCryptoPriceHistory(currentCrypto.symbol);
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentCrypto = getCryptoDetails(nextProps.crypto);
    const isDifferentCrypto = this.props.crypto !== nextProps.crypto;
    if (isDifferentCrypto || nextProps.refreshCharts) {
      this.setState(
        {
          currentCrypto,
        },
        () => this.props.getCryptoPriceHistory(currentCrypto.symbol, true),
      );
    } else {
      this.setState({
        currentCrypto,
      });
    }
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

  render() {
    const { cryptosPriceHistory } = this.props;
    const { currentCrypto } = this.state;
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

    if (_.isEmpty(currentCrypto) || _.isEmpty(usdPriceHistory)) return null;

    return (
      <div>
        <div className="SidebarContentBlock__content">
          <div className="CryptoTrendingCharts__chart-header">
            <div className="CryptoTrendingCharts__crypto-name">{currentCrypto.name}</div>
            {this.renderUSDPrice()}
          </div>
        </div>
      </div>
    );
  }
}

export default CryptoChart;
