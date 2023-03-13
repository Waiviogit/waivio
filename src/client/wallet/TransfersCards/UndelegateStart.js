import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const UndelegateStart = ({ timestamp, account, symbol, to, from, quantity }) => {
  const isReceive = account !== to;
  const cardInfo = isReceive
    ? {
        description: (
          <span>
            <FormattedMessage id="undelegated_by" defaultMessage="by" />{' '}
            <a href={`/@${to}`} className="username">
              {to}
            </a>{' '}
          </span>
        ),
        color: 'black',
        point: '-',
      }
    : {
        description: (
          <span>
            <FormattedMessage id="lowercase_to" defaultMessage="to" />{' '}
            <a href={`/@${from}`} className="username">
              {from}
            </a>{' '}
          </span>
        ),
        color: 'black',
        point: '+',
      };

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      // iconType={'arrow-left'}
      symbol={symbol}
      quantity={quantity}
      color={cardInfo.color}
      point={cardInfo.point}
      account={isReceive ? to : from}
    >
      <span>
        <FormattedMessage id="undelegated" defaultMessage="Undelegated" />{' '}
        {(to || from) && cardInfo.description}{' '}
      </span>{' '}
    </TransactionCardContainer>
  );
};

UndelegateStart.propTypes = {
  timestamp: PropTypes.number.isRequired,
  account: PropTypes.string.isRequired,
  to: PropTypes.string,
  from: PropTypes.string,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

UndelegateStart.defaultProps = {
  to: '',
  from: '',
};

export default UndelegateStart;
