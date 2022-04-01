import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';
import '../UserWalletTransactions/UserWalletTransactions.less';

const DelegatedTo = ({ timestamp, quantity, symbol, to, from, account }) => {
  const isReceive = account === to;
  const link = isReceive ? from : to;

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={symbol}
      iconType={'arrow-right'}
      color={isReceive ? 'green' : 'red'}
    >
      <p>
        {isReceive ? (
          <FormattedMessage id="delegation_from" defaultMessage="Delegation from" />
        ) : (
          <FormattedMessage id="delegated_to" defaultMessage="Delegated to" />
        )}
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
  symbol: PropTypes.string.isRequired,
};

export default DelegatedTo;
