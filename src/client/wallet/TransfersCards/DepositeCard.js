import React from 'react';
import PropTypes from 'prop-types';
import TransactionCardContainer from './TransactionCardContainer';

const DepositeCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    symbol={props.symbol}
    quantity={props.quantity}
    iconType={'arrow-right'}
    color={'green'}
    fractionDigits={5}
  >
    <div>Deposit</div>
  </TransactionCardContainer>
);

DepositeCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default DepositeCard;
