import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from '../TransactionCardContainer';

import './TokenBoughtCard.less';

const TokenActionInMarketCard = ({ from, to, symbol, quantity, timestamp, action }) => {
  const color = action === 'Bought' ? 'green' : 'red';

  const recipient = from || to;
  const sent = from ? ' from ' : ' to ';

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      symbol={symbol}
      quantity={quantity}
      account={recipient}
      color={color}
    >
      <p>
        {action} {symbol}
        {recipient && (
          <span>
            {sent}
            <a href={`/@${recipient}`} className="TokenBoughtCard__userName">
              {recipient}
            </a>
          </span>
        )}
      </p>
    </TransactionCardContainer>
  );
};

TokenActionInMarketCard.propTypes = {
  quantity: PropTypes.string.isRequired,
  timestamp: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default TokenActionInMarketCard;
