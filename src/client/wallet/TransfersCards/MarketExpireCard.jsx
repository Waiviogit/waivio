import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const MarketExpireCard = ({ timestamp, quantity, orderType }) => {
  const currentSymbol = orderType === 'sell' ? 'WAIV' : 'SWAP.HIVE';

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={currentSymbol}
      iconType={'tag'}
    >
      <div>
        <FormattedMessage
          id={`market_expired_to_${orderType}`}
          defaultMessage={`Market expired to ${orderType}`}
        />
      </div>
    </TransactionCardContainer>
  );
};

MarketExpireCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  orderType: PropTypes.string.isRequired,
};

export default MarketExpireCard;
