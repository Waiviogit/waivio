import React from 'react';
import PropTypes from 'prop-types';

import TransactionCardContainer from './TransactionCardContainer';

const SwapTokenCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    iconType={'swap'}
    symbol={props.symbolTo}
    quantity={props.quantity}
  >
    Swap {props.symbolFrom} to {props.symbolTo}
  </TransactionCardContainer>
);

SwapTokenCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbolFrom: PropTypes.string.isRequired,
  symbolTo: PropTypes.string.isRequired,
};

export default SwapTokenCard;
