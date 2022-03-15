import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const MarketBuyCard = ({ timestamp, quantity, orderType, symbol }) => {
  const isLimitOrder = orderType === 'sell' || orderType === 'buy';
  const isMarketOrder = orderType === 'marketSell' ? 'sell' : 'buy';

  return (
    <div>
      <TransactionCardContainer
        timestamp={timestamp}
        quantity={quantity}
        symbol={isLimitOrder ? `per ${symbol}` : symbol}
        iconType={'tag'}
      >
        <div>
          <FormattedMessage
            id={isLimitOrder ? `limit_order_to_${orderType}` : `market_order_to_${isMarketOrder}`}
            defaultMessage={
              isLimitOrder ? `Limit order to ${orderType}` : `Market order to ${isMarketOrder}`
            }
          />
        </div>
      </TransactionCardContainer>
    </div>
  );
};

MarketBuyCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  orderType: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default MarketBuyCard;
