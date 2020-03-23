import React from 'react';
import PropTypes from 'prop-types';
import TradingForm from './TradingForm';

const TradingFormWrapper = props => {
  return (
    <div className="st-trading-form-wrapper">
      <TradingForm direction="buy" />
      <hr/>
      <TradingForm direction="sell" />
    </div>
  );
};

TradingFormWrapper.propTypes = {};

export default TradingFormWrapper;
