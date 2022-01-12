import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const AirDropCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    symbol={props.symbol}
    quantity={props.quantity}
    account={props.account}
    color={'green'}
  >
    <div>Airdrop</div>
  </TransactionCardContainer>
);

AirDropCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default AirDropCard;
