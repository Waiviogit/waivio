import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';

import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import { currencyPrefix } from '../../websites/constants/currencyTypes';

const USDDisplay = React.memo(({ value, currencyDisplay, precision, minimumFractionDigits }) => {
  const currencyInfo = useSelector(getCurrentCurrency);
  const validValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const absValue = validValue === 0 ? validValue : Math.abs(validValue);
  // eslint-disable-next-line no-nested-ternary
  const precisionValue =
    // eslint-disable-next-line no-nested-ternary
    typeof precision === 'number'
      ? precision
      : absValue > 0.01 || absValue === 0 || absValue < 0.001
      ? 2
      : 3;
  const currencyRate =
    currencyInfo && typeof currencyInfo.rate === 'number' && !isNaN(currencyInfo.rate)
      ? currencyInfo.rate
      : 1;
  const sum = absValue * currencyRate;
  const formatted = num => (
    <FormattedNumber
      value={num}
      locale={'en-IN'}
      minimumFractionDigits={minimumFractionDigits || precisionValue}
      maximumFractionDigits={precisionValue}
    />
  );

  const formattedCurrency = num => {
    const type = currencyInfo.type || 'USD';

    switch (currencyDisplay) {
      case 'code':
        return (
          <React.Fragment>
            {formatted(num)} {type}
          </React.Fragment>
        );
      case 'symbol':
        return (
          <React.Fragment>
            {currencyPrefix[type]} {formatted(num)}
          </React.Fragment>
        );
      default:
        return formatted(num);
    }
  };

  return (
    <span className="USDDisplay" title={sum}>
      {formattedCurrency(sum)}
    </span>
  );
});

USDDisplay.propTypes = {
  value: PropTypes.number,
  precision: PropTypes.number,
  minimumFractionDigits: PropTypes.number,
  currencyDisplay: PropTypes.string,
  style: PropTypes.shape({}),
};

USDDisplay.defaultProps = {
  value: 0,
  currencyDisplay: 'code',
  style: {},
};

export default USDDisplay;
