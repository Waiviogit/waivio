import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TransactionCardContainer from './TransactionCardContainer';

const UndelegateCompleted = ({ timestamp, symbol, quantity }) => (
  <TransactionCardContainer
    timestamp={timestamp}
    iconType={'arrow-right'}
    symbol={symbol}
    quantity={quantity}
    color={'black'}
  >
    <span>
      <FormattedMessage id="undelegated_completed" defaultMessage="Undelegated completed" />
    </span>{' '}
  </TransactionCardContainer>
);

UndelegateCompleted.propTypes = {
  timestamp: PropTypes.number.isRequired,
  quantity: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default UndelegateCompleted;
