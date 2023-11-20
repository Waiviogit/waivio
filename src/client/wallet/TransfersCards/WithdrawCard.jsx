import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const WithdawCard = props => (
  <TransactionCardContainer
    timestamp={props.timestamp}
    symbol={props.symbol}
    quantity={props.quantity}
    iconType={'dollar'}
    color={'red'}
    fractionDigits={5}
  >
    <div>
      {' '}
      <FormattedMessage id="withdraw" defaultMessage="Withdraw" />
    </div>
  </TransactionCardContainer>
);

WithdawCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default WithdawCard;
