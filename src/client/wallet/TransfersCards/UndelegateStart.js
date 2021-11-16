import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const UndelegateStart = ({ timestamp, account, to, from, quantity, symbol }) => {
  const isReceive = account === to;

  const cardInfo = isReceive
    ? {
        description: (
          <span>
            Undelegated started from{' '}
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
            Undelegated started to{' '}
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
      iconType={'arrow-left'}
      symbol={symbol}
      quantity={quantity}
      color={cardInfo.color}
      point={cardInfo.point}
    >
      {cardInfo.description}
    </TransactionCardContainer>
  );
};

UndelegateStart.propTypes = {
  timestamp: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default UndelegateStart;
