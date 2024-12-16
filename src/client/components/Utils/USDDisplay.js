import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';

import { getCurrentCurrency } from '../../../store/appStore/appSelectors';
import { currencyPrefix } from '../../websites/constants/currencyTypes';

const USDDisplay = React.memo(({ value, currencyDisplay }) => {
  const currencyInfo = useSelector(getCurrentCurrency);
  const absValue = Math.abs(value) || 0;
  const precision = absValue > 0.01 || absValue === 0 || absValue < 0.001 ? 2 : 3;
  const sum = absValue * currencyInfo.rate;
  const formatted = num => (
    <FormattedNumber
      value={num}
      locale={'en-IN'}
      minimumFractionDigits={precision}
      maximumFractionDigits={precision}
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
  currencyDisplay: PropTypes.string,
  style: PropTypes.shape({}),
};

USDDisplay.defaultProps = {
  value: 0,
  currencyDisplay: 'code',
  style: {},
};

export default USDDisplay;
