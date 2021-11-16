import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const ReceivedDelegation = ({ timestamp, quantity, from, symbol }) => (
  <TransactionCardContainer
    timestamp={timestamp}
    quantity={quantity}
    symbol={symbol}
    iconType={'arrow-right'}
  >
    <span>
      Received delegation from{' '}
      <a href={`/@${from}`}>
        <span className="username">{from}</span>
      </a>
    </span>
  </TransactionCardContainer>
);

ReceivedDelegation.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default ReceivedDelegation;
