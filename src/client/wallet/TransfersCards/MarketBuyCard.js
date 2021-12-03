import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const MarketBuyCard = ({ timestamp, quantity, orderType, symbol }) => {
  const amountInfo = orderType !== 'buy' && { color: 'black', point: '' };

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={`per ${symbol}`}
      iconType={'tag'}
      color={amountInfo.color}
      point={amountInfo.point}
    >
      <span>Limit order to {orderType}</span>
    </TransactionCardContainer>
  );
};

MarketBuyCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  orderType: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default MarketBuyCard;
