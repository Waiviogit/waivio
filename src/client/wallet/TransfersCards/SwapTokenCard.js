import React from 'react';
import PropTypes from 'prop-types';

import TransactionCardContainer from './TransactionCardContainer';

const SwapTokenCard = props => {
  let color = 'red';

  if (props.walletType === 'ENGINE' && props.symbolTo !== 'WAIV') color = 'green';
  if (props.walletType === 'WAIV' && props.symbolTo === 'WAIV') color = 'green';

  return (
    <TransactionCardContainer
      timestamp={props.timestamp}
      iconType={'swap'}
      symbol={props.symbolTo}
      quantity={props.quantity}
      color={color}
    >
      Swap {props.symbolFrom} to {props.symbolTo}
    </TransactionCardContainer>
  );
};

SwapTokenCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbolFrom: PropTypes.string.isRequired,
  symbolTo: PropTypes.string.isRequired,
  walletType: PropTypes.string.isRequired,
};

export default SwapTokenCard;
