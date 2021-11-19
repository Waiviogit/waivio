import classNames from 'classnames';
import { FormattedNumber } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';

const CryptoRateInCurrency = ({
  currentUSDPrice,
  priceDifference,
  minimumFractionDigits,
  currency,
  valueClassName,
}) => {
  const usdIncrease = priceDifference ? priceDifference >= 0 : false;
  let usdPriceDifferencePercent = priceDifference;

  if (usdPriceDifferencePercent) usdPriceDifferencePercent /= 100;

  return (
    <div className="CryptoTrendingCharts__chart-value">
      <span className={valueClassName}>
        <FormattedNumber value={currentUSDPrice} minimumFractionDigits={minimumFractionDigits} />{' '}
        {currency}
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
};

CryptoRateInCurrency.propTypes = {
  currentUSDPrice: PropTypes.number.isRequired,
  priceDifference: PropTypes.number.isRequired,
  minimumFractionDigits: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired,
  valueClassName: PropTypes.string.isRequired,
};

export default CryptoRateInCurrency;
