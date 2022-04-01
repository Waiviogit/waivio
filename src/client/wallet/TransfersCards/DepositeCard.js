import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
    <div>
      <FormattedMessage id="Deposit" defaultMessage="Deposit" />
    </div>
  </TransactionCardContainer>
);

DepositeCard.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default DepositeCard;
