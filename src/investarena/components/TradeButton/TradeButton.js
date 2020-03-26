import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './TradeButton.less';

const TradeButton = ({ children, size, type, onClick }) => {
  return (
    <div
      role="presentation"
      className={ classNames(`st-trade-button ${type}`, { large: size === 'large' })}
      onClick={onClick}
    >
      {children || type}
    </div>
  );
};

TradeButton.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  size: PropTypes.oneOf(['default', 'large']),
  type: PropTypes.oneOf(['buy', 'sell']).isRequired,
  onClick: PropTypes.func,
};

TradeButton.defaultProps = {
  children: null,
  size: 'default',
  onClick: () => {},
};

export default TradeButton;
