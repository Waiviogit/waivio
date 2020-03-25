import React from 'react';
import PropTypes from 'prop-types';
import TradingForm from './TradingForm';

const TradingFormWrapper = ({ quoteSecurity }) => {
  return (
    <div className="st-trading-form-wrapper">
      <TradingForm
        side="buy"
        quoteSecurity={quoteSecurity}
      />
      <hr/>
      <TradingForm
        side="sell"
        quoteSecurity={quoteSecurity}
      />
    </div>
  );
};

TradingFormWrapper.propTypes = {
  quoteSecurity: PropTypes.string.isRequired,
};

export default TradingFormWrapper;
