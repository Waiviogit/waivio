import React from 'react';
import PropTypes from 'prop-types';
import TradingForm from './TradingForm';

const TradingFormWrapper = ({ caller, quoteSecurity }) => (
  <div className="st-trading-form-wrapper">
    <TradingForm caller={caller} quoteSecurity={quoteSecurity} side="buy" />
    <hr />
    <TradingForm caller={caller} quoteSecurity={quoteSecurity} side="sell" />
  </div>
);

TradingFormWrapper.propTypes = {
  caller: PropTypes.string.isRequired,
  quoteSecurity: PropTypes.string.isRequired,
};

export default TradingFormWrapper;
