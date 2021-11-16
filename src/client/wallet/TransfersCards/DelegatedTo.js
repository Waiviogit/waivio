import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const DelegatedTo = ({ timestamp, quantity, symbol, to, from, account }) => {
  const isReceive = account === to;

  const cardInfo = isReceive
    ? {
        description: (
          <span>
            Delegated from{' '}
            <a href={`/@${from}`} className="username">
              {from}
            </a>
          </span>
        ),
        color: 'green',
        point: '+',
      }
    : {
        description: (
          <span>
            Delegated to{' '}
            <a href={`/@${to}`} className="username">
              {to}
            </a>
          </span>
        ),
        color: 'red',
        point: '-',
      };

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={symbol}
      iconType={'arrow-right'}
      color={cardInfo.color}
      point={cardInfo.point}
    >
      {cardInfo.description}
    </TransactionCardContainer>
  );
};

DelegatedTo.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
};

export default DelegatedTo;
