import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';
import { useSelector } from 'react-redux';
import { round } from 'lodash';

import { getCurrentCurrency } from '../../../store/appStore/appSelectors';

const USDDisplay = ({ value, currencyDisplay, style, roundTo }) => {
  const currencyInfo = useSelector(getCurrentCurrency);
  const negative = value < 0;
  const absValue = round(Math.abs(value) * currencyInfo.rate, roundTo);

  return (
    <span style={style} title={absValue}>
      {negative && '-'}
      {/* eslint-disable react/style-prop-object */}
      <FormattedNumber
        style="currency"
        currencyDisplay={currencyDisplay}
        currency={currencyInfo.type}
        value={absValue}
      />
    </span>
  );
};

USDDisplay.propTypes = {
  value: PropTypes.number,
  roundTo: PropTypes.number,
  currencyDisplay: PropTypes.string,
  style: PropTypes.shape({}),
};

USDDisplay.defaultProps = {
  value: 0,
  roundTo: 3,
  currencyDisplay: 'code',
  style: {},
};

export default USDDisplay;
