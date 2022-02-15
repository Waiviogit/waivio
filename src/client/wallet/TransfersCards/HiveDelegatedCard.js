import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';
import '../UserWalletTransactions/UserWalletTransactions.less';

const HiveDelegatedCard = ({ timestamp, quantity, symbol, to, from, account }) => {
  const isReceive = account === from;
  const link = isReceive ? from : to;
  let delegation = isReceive ? 'Update delegation from' : 'Update delegation to';

  if (!quantity) {
    delegation = isReceive ? 'Undelegated from' : 'Undelegated to';
  }

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={symbol}
      iconType={'arrow-right'}
      color={isReceive ? 'green' : 'red'}
    >
      <p>
        {delegation}
        <span className="UserWalletTransactions__delegated">
          <a className="UserWalletTransactions__delegated-color" href={`/@${link}`}>
            {link}
          </a>
        </span>
      </p>
    </TransactionCardContainer>
  );
};

HiveDelegatedCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default HiveDelegatedCard;
