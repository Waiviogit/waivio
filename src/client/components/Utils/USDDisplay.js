import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';

import { getCurrentCurrency } from '../../store/appStore/appSelectors';

const USDDisplay = ({ value, currencyDisplay, style }) => {
  const currencyInfo = useSelector(getCurrentCurrency);
  const negative = value < 0;
  const absValue = Math.abs(value);
  // 0.02 is dust payout threshold (STEEM_MIN_PAYOUT_SBD)
  const precision = absValue < 0.02 && absValue > 0 ? 3 : 2;

  return (
    <span style={style}>
      {negative && '-'}
      {/* eslint-disable react/style-prop-object */}
      <FormattedNumber
        style="currency"
        currencyDisplay={currencyDisplay}
        currency={currencyInfo.type}
        value={absValue * currencyInfo.rate}
        minimumFractionDigits={precision}
        maximumFractionDigits={precision}
      />
    </span>
  );
};

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
