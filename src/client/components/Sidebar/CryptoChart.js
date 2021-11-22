import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';

import Loading from '../Icon/Loading';
import ChartGenerator from './CrypoCharts/ChartGenerator';
import CryptoRateInUsd from './CrypoCharts/CryptoRateInCurrency';
import { CRYPTO_MAP } from '../../../common/constants/cryptos';
import {
  getTokenRatesInSelectCurrency,
  getTokenRatesInSelectCurrencyChanged,
  getTokenRatesInUSD,
  getTokenRatesInUSDChanged,
  getWeeklyTokenRatesPrice,
} from '../../../store/walletStore/walletSelectors';

const CryptoChart = props => {
  const [displayChart, setDisplayChart] = useState(false);
  const chartContainer = useRef();
  const toggleDisplayChart = () => setDisplayChart(state => !state);

  if (isEmpty(props.price)) {
    return (
      <div>
        <div className="SidebarContentBlock__content">
          <Loading />
        </div>
      </div>
    );
  }

  const toggleButtonClassNames = classNames('iconfont CryptoTrendingCharts__display-icon', {
    'icon-unfold': !displayChart,
    'icon-packup': displayChart,
  });

  return (
    <div ref={chartContainer}>
      <div className="SidebarContentBlock__content">
        <div className="CryptoTrendingCharts__chart-header">
          <div className="CryptoTrendingCharts__crypto-name">
            {CRYPTO_MAP[props.crypto].name}
            <i
              role="presentation"
              onClick={toggleDisplayChart}
              className={toggleButtonClassNames}
            />
          </div>
          <CryptoRateInUsd
            currentUSDPrice={props.usdPrice}
            priceDifference={props.usdPriceChange}
            minimumFractionDigits={3}
            valueClassName={'CryptoTrendingCharts__usd-price'}
          />
          {props.currency && (
            <CryptoRateInUsd
              currentUSDPrice={props.currencyPrice}
              priceDifference={props.currencyPriceChange}
              minimumFractionDigits={7}
              currency={props.currency}
              valueClassName={'CryptoTrendingCharts__btc-price'}
            />
          )}
        </div>
      </div>
      {displayChart && (
        <ChartGenerator prices={props.price} width={chartContainer.current.clientWidth} />
      )}
    </div>
  );
};

CryptoChart.propTypes = {
  crypto: PropTypes.string,
  usdPrice: PropTypes.number,
  usdPriceChange: PropTypes.number,
  currencyPrice: PropTypes.number,
  currencyPriceChange: PropTypes.number,
  currency: PropTypes.string,
  price: PropTypes.arrayOf(PropTypes.number),
};

CryptoChart.defaultProps = {
  crypto: PropTypes.string,
  usdPrice: 0,
  usdPriceChange: 0,
  currencyPrice: 0,
  currency: '',
  currencyPriceChange: 0,
  price: [],
};

CryptoChart.defaultProps = {
  crypto: '',
};

export default connect((state, props) => ({
  price: getWeeklyTokenRatesPrice(state, props.crypto),
  usdPrice: getTokenRatesInUSD(state, props.crypto),
  usdPriceChange: getTokenRatesInUSDChanged(state, props.crypto),
  currencyPrice: getTokenRatesInSelectCurrency(state, props.crypto, props.currency),
  currencyPriceChange: getTokenRatesInSelectCurrencyChanged(state, props.crypto, props.currency),
}))(CryptoChart);
