import React from 'react';
import PropTypes from 'prop-types';
import './TradeButton.less';

const TradeButton = ({ type, onClick }) => {
  return (
    <div role="presentation" className={`st-trade-button ${type}`} onClick={onClick}>
      {type}
    </div>
  );
};

TradeButton.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

TradeButton.defaultProps = {
  onClick: () => {},
};

export default TradeButton;
