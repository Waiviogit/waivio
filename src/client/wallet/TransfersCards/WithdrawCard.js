import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const WithdawCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    symbol={props.symbol}
    quantity={props.quantity}
    iconType={'dollar'}
    color={'green'}
    fractionDigits={5}
  >
    <div>Withdraw</div>
  </TransactionCardContainer>
);

WithdawCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default WithdawCard;
