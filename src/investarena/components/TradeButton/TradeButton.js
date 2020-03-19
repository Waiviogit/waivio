import React from 'react';
import PropTypes from 'prop-types';
import './TradeButton.less';

const TradeButton = ({ type }) => {
  return (
    <div className={`st-trade-button ${type}`}>
      {type}
    </div>
  );
};

TradeButton.propTypes = {
  type: PropTypes.string.isRequired,
};

export default TradeButton;
