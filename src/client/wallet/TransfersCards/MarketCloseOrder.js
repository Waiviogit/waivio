import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const MarketCloseOrder = ({ timestamp, orderType }) => (
  <TransactionCardContainer timestamp={timestamp} iconType={'check'}>
    <span>Limit order to {orderType} successful</span>
  </TransactionCardContainer>
);

MarketCloseOrder.propTypes = {
  timestamp: PropTypes.number.isRequired,
  orderType: PropTypes.string.isRequired,
};

export default MarketCloseOrder;
