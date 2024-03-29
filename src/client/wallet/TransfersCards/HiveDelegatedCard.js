import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';
import '../UserWalletTransactions/UserWalletTransactions.less';

const HiveDelegatedCard = ({ timestamp, quantity, symbol, to, from, account }) => {
  const isReceive = account === from;
  const link = isReceive ? to : from;
  let delegation = isReceive ? (
    <FormattedMessage id="delegation_from" defaultMessage="Delegation from" />
  ) : (
    <FormattedMessage id="delegated_to" defaultMessage="Delegated to" />
  );

  if (!quantity) {
    delegation = isReceive ? (
      <FormattedMessage id="undelegated_from" defaultMessage="Undelegated from" />
    ) : (
      <FormattedMessage id="undelegated_to" defaultMessage="Undelegated to" />
    );
  }

  return (
    <TransactionCardContainer
      timestamp={timestamp}
      quantity={quantity}
      symbol={symbol}
      iconType={'arrow-right'}
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
