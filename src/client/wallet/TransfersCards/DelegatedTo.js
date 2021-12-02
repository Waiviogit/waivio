import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';
import '../UserWalletTransactions.less';

const DelegatedTo = ({ timestamp, quantity, to, from, account }) => {
  const isReceive = account === to;
  const link = isReceive ? from : to;
  const cardInfo = isReceive
    ? {
        description: (
          <span>
            from{' '}
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
            to{' '}
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
      symbol={'WP'}
      iconType={'arrow-right'}
      color={cardInfo.color}
      point={cardInfo.point}
    >
      {`Delegated ${isReceive ? 'from' : 'to'}`}
      <div className="UserWalletTransactions__delegated">
        <a className="UserWalletTransactions__delegated-color" href={`/@${link}`}>
          {link}
        </a>
      </div>
    </TransactionCardContainer>
  );
};

DelegatedTo.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
};

export default DelegatedTo;
