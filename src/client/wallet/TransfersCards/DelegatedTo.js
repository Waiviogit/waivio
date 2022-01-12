import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';
import '../UserWalletTransactions/UserWalletTransactions.less';

const DelegatedTo = ({ timestamp, quantity, to, from, account }) => {
  const isReceive = account === to;
  const link = isReceive ? from : to;
  const delegation = isReceive ? 'Delegation from' : 'Delegated to';

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={'WP'}
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

DelegatedTo.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired,
};

export default DelegatedTo;
